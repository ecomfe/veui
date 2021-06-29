import { normalize } from 'vue-directive-normalizer'
import {
  isObject,
  noop,
  get,
  isString,
  isEqual,
  difference,
  omit
} from 'lodash'
import { getNodes } from '../utils/context'
import { isFirefox as checkIsFirefox } from '../utils/bom'
import BaseHandler from './drag/BaseHandler'
import TranslateHandler from './drag/TranslateHandler'
import SortHandler from './drag/SortHandler'
import warn from '../utils/warn'

const isFirefox = checkIsFirefox()

const HANDLERS = {}

// TODO: remove this after 2.0.0.
let draggableDeprecationWarned = false

const OPTIONS_SCHEMA = {
  arg: 'targets[]',
  modifiers: () => ({
    type: Object.keys(HANDLERS),
    axis: [null, 'x', 'y']
  }),
  defaults: {
    disabled: false,
    dragstart: noop,
    drag: noop,
    dragend: noop,
    ready: noop
  }
}

export function registerHandler (name, Handler, isNativeDrag) {
  if (!(Handler.prototype instanceof BaseHandler)) {
    throw new Error('The handler class must derive from `BaseHandler`.')
  }
  HANDLERS[name] = { Handler, isNativeDrag }
}

registerHandler('translate', TranslateHandler, false)
registerHandler('sort', SortHandler, true)

function clear (el) {
  let dragData = el.__dragData__
  if (!dragData) {
    return
  }

  dragData.cleanup()

  el.__dragData__ = null
  el.__dragOldOptions__ = null
}

function getOptions (binding, vnode) {
  let options = normalize(binding, OPTIONS_SCHEMA)

  let { containment, handle } = options

  // 如果 containment 不是特殊配置，也不是 object ，或者是 object ，
  // 但是没有完整的 top 、 left 、 width 、 height 属性，
  // 就要看看用 containment 能不能选出 DOM Element 了。
  if (!isSpecialSyntax(containment) && !isRect(containment)) {
    options.containment = get(getNodes(containment, vnode.context), '[0]', null)
  }

  options.target = vnode.elm
  options.handle = get(getNodes(handle, vnode.context), '[0]', vnode.elm)

  return options
}

function refresh (el, binding, vnode) {
  const options = getOptions(binding, vnode)

  if ('draggable' in options && !draggableDeprecationWarned) {
    warn(
      '[v-drag] The `draggable` option is deprecated and will be removed in v2.0.0. Please use `disabled` instead.'
    )
    draggableDeprecationWarned = true

    if (options.draggable === false) {
      options.disabled = true
    }
  }

  if (options.disabled) {
    clear(el)
    return
  }

  const oldOptions = el.__dragOldOptions__
  // 如果参数没发生变化，就不要刷新了
  if (
    difference(get(options, 'targets', []), get(oldOptions, 'targets', []))
      .length === 0 &&
    isEqual(omit(options, 'targets'), omit(oldOptions, 'targets'))
  ) {
    return
  }
  el.__dragOldOptions__ = options

  clear(el)

  let contextComponent = vnode.context
  let handler = null
  let isNative
  if (HANDLERS[options.type]) {
    let { Handler, isNativeDrag } = HANDLERS[options.type]
    isNative = isNativeDrag
    handler = new Handler(options, contextComponent, vnode)
  } else {
    throw new Error(
      `[v-drag] The handler type "${options.type}" is not registered.`
    )
  }

  options.ready({ reset: () => handler.reset() })

  let { target, handle } = options

  let dragData = {
    dragging: false,
    initX: 0,
    initY: 0,
    handler,

    prepareHandler () {
      // 原生拖拽需要在 handle 触发 mousedown 时设置 draggable 后，在 dragend 时重置
      target.draggable = true
    },

    cleanupOnce: noop,
    cleanup () {
      dragData.cleanupOnce()

      target.removeEventListener(
        isNative ? 'dragstart' : 'mousedown',
        dragData.mouseDownHandler
      )
      dragData.handler.destroy()
    },

    mouseDownHandler (event) {
      if (options.disabled || event.button !== 0) {
        return
      }

      let { clientX, clientY } = event
      dragData.initX = clientX
      dragData.initY = clientY
      let args = { event }
      handler.start({ ...args })
      contextComponent.$emit('dragstart', { ...args })
      options.dragstart({ ...args })

      function selectStartHandler (e) {
        e.preventDefault()
      }

      function mouseMoveHandler (event) {
        let { clientX, clientY } = event
        let args = {
          distanceX: clientX - dragData.initX,
          distanceY: clientY - dragData.initY,
          event
        }
        handler.drag({ ...args })
        contextComponent.$emit('drag', { ...args })
        options.drag({ ...args })
      }

      function mouseUpHandler (event) {
        let { clientX, clientY } = event

        let cancelled = false
        let args = {
          distanceX: clientX - dragData.initX,
          distanceY: clientY - dragData.initY,
          cancel: () => {
            cancelled = true
          },
          event
        }
        handler.drag({ ...args, last: true })
        contextComponent.$emit('dragend', { ...args })
        options.dragend({ ...args })
        handler.end({
          ...args,
          ...(cancelled
            ? {
              distanceX: 0,
              distanceY: 0
            }
            : {})
        })

        removeOnceListeners()
      }

      // TODO: 非IE下面不用移除选区
      window.getSelection().removeAllRanges()
      window.addEventListener('selectstart', selectStartHandler)

      if (isNative) {
        if (isFirefox) {
          // Firefox dragevent 里面的鼠标坐标是 0
          // https://bugzilla.mozilla.org/show_bug.cgi?id=505521
          window.addEventListener('dragover', mouseMoveHandler)
        } else {
          target.addEventListener('drag', mouseMoveHandler)
        }
        target.addEventListener('dragend', mouseUpHandler)
      } else {
        window.addEventListener('mousemove', mouseMoveHandler)
        window.addEventListener('mouseup', mouseUpHandler)
      }

      function removeOnceListeners () {
        if (isNative) {
          if (isFirefox) {
            window.removeEventListener('dragover', mouseMoveHandler)
          } else {
            target.removeEventListener('drag', mouseMoveHandler)
          }
          target.removeEventListener('dragend', mouseUpHandler)

          target.draggable = false
          target.removeEventListener('mousedown', dragData.prepareHandler)
        } else {
          window.removeEventListener('mousemove', mouseMoveHandler)
          window.removeEventListener('mouseup', mouseUpHandler)
        }
        window.removeEventListener('selectstart', selectStartHandler)

        dragData.cleanupOnce = noop
      }

      dragData.cleanupOnce = removeOnceListeners
    }
  }

  if (isNative) {
    handle.addEventListener('mousedown', dragData.prepareHandler)
  }

  target.addEventListener(
    isNative ? 'dragstart' : 'mousedown',
    dragData.mouseDownHandler
  )
  el.__dragData__ = dragData
}

function isSpecialSyntax (value) {
  return isString(value) && value.indexOf('@') === 0
}

function isRect (containment) {
  return (
    isObject(containment) &&
    'top' in containment &&
    'left' in containment &&
    'width' in containment &&
    'height' in containment
  )
}

/**
 * drag 指令基本使用方式如下：
 *
 * ```html
 * <div v-drag></div>
 * ```
 *
 * 在拖动过程中，drag 指令会依次向当前组件 context 发送 dragstart、drag、dragend 事件，
 * 并带上拖动距离作为参数，在当前组件中可以监听这些事件：
 *
 * ```js
 * this.$on('dragstart', ({ event }) => { ... })
 * this.$on('drag', ({ event, distanceX, distanceY }) => { ... })
 * this.$on('dragend', ({ event, distanceX, distanceY }) => { ... })
 * ```
 *
 * 在各个事件的回调函数中，可以对目标 DOM 元素进行操作，从而达到拖动等效果。
 *
 * drag 指令内部也提供了一个默认的拖动处理器，借助 translate 来移动目标元素。可以通过指令的 arg
 * 指定要使用的拖动处理器（目前仅支持 translate ），通过 value 并借助 vue 的 refs 来指定目标元素：
 *
 * ```html
 * <p ref="target1"></p>
 * <p ref="target2"></p>
 * <div v-drag.translate="['target1', 'target2']"></div>
 * ```
 *
 * drag 指令也可以随时关闭 drag 功能，只需要传入值为 true 的 disabled 参数即可：
 *
 * ```html
 * <div v-drag="{targets: ['target1', 'target2'], type: 'translate', disabled: true}"></div>
 * ```
 *
 * 可以通过传递 containment 参数来限制拖动的范围。
 * containment 参数可以是结构为 `{ left: 0, top: 0, width: 100, height: 0}` 的对象：
 *
 * ```html
 * <div v-drag.translate="{targets: ['content'], type: 'translate', containment: {left: 0, top: 0, width: 100, height: 100}}"></div>
 * ```
 *
 * 也可以是一个 DOM 节点或者 ref 指向的节点：
 *
 * ```html
 * <div v-drag.translate="{targets: ['content'], type: 'translate', containment: body}"></div>
 * ```
 *
 * 可以通过传递 axis 参数来限定拖动的方向，x 表明在水平方向拖动，y 表示在垂直方向拖动：
 *
 * ```html
 * <div v-drag.translate="{targets: ['content'], type: 'translate', axis: 'x', ready: (handle) => { ... }}"></div>
 * ```
 * `ready` 参数是一个回调函数，当 drag 指令准备就绪后会调用该函数，并传回一个句柄 `handle` ，句柄上提供了 `reset` 方法，可以将 targets 元素
 * 的视觉重置为 drag 之前的的效果。
 *
 * drag 指令的复杂参数可以通过 `value` 的方式传递，在一些简单场景下，也可以通过 modifier 、 arg 传递参数：
 *
 * ```html
 * <div v-drag:ref1,ref2.translate.x="{...}"></div>
 * ```
 *
 * 其中，`ref1,ref2` 对应 targets 参数， `translate` 对应 type 参数， `x` 对应 axis 参数。
 *
 * drag 指令也支持自定义 Handler ：
 *
 * ```js
 * import BaseHandler from 'veui/directives/drag/BaseHandler'
 *
 * export default class CustomHandler extends BaseHandler {
 *   ...
 * }
 * ```
 *
 * 然后将自定义 Handler 注册到 drag 中去：
 *
 * ```js
 * import { registerHandler } from 'veui/directives/drag'
 *
 * registerHandler('customHandler', CustomHandler)
 * ```
 *
 * 在使用的时候，就可以把 type 参数设置为 `customHandler` 了：
 *
 * ```html
 * <div v-drag.translate="{targets: ['content'], type: 'customHandler', axis: 'x'"></div>
 * ```
 *
 * **注：** 自定义 Handler 必须继承自 `BaseHandler` 。
 */
export default {
  inserted: refresh,
  componentUpdated: refresh,
  unbind: clear
}

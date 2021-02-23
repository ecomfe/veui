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
import config from '../managers/config'

config.defaults({
  'drag.prefix': '@'
})

const isFirefox = checkIsFirefox()

const HANDLERS = {}

const OPTIONS_SCHEMA = {
  arg: 'targets[]',
  modifiers: () => ({
    type: Object.keys(HANDLERS),
    axis: [null, 'x', 'y']
  }),
  defaults: {
    draggable: true,
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
  dragData.handler.destroy()
  el.removeEventListener('mousedown', dragData.mousedownHandler)
  el.__dragData__ = null
  el.__dragOldOptions__ = null
}

function getOptions (binding, vnode) {
  let options = normalize(binding, OPTIONS_SCHEMA)

  let { containment } = options

  // 如果 containment 不是特殊配置，也不是 object ，或者是 object ，
  // 但是没有完整的 top 、 left 、 width 、 height 属性，
  // 就要看看用 containment 能不能选出 DOM Element 了。
  if (!isSpecialSyntax(containment) && !isRect(containment)) {
    options.containment = get(getNodes(containment, vnode.context), '[0]', null)
  }

  return options
}

function refresh (el, binding, vnode) {
  const options = getOptions(binding, vnode)

  if (options.disabled) {
    // TODO：先不支持动态切换
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

  if (el.__dragData__) {
    el.__dragData__.handler.setOptions(options)
  } else {
    let contextComponent = vnode.context
    let handler = null
    let isNativeDrag
    if (HANDLERS[options.type]) {
      let { Handler, isNativeDrag: _isNativeDrag } = HANDLERS[options.type]
      isNativeDrag = _isNativeDrag
      handler = new Handler(options, contextComponent, vnode)
    } else {
      throw new Error(`No handler is registered for type "${options.type}".`)
    }

    options.ready({ reset: () => handler.reset() })

    let dragData = {
      dragging: false,
      initX: 0,
      initY: 0,
      handler,

      mousedownHandler (event) {
        if (!options.draggable || event.button !== 0) {
          return
        }

        let { clientX, clientY } = event
        dragData.initX = clientX
        dragData.initY = clientY
        handler.start({ event })
        contextComponent.$emit('dragstart', { event })
        options.dragstart({ event })

        function selectStartHandler (e) {
          e.preventDefault()
        }

        function mouseMoveHandler (event) {
          let { clientX, clientY } = event
          let dragParams = {
            distanceX: clientX - dragData.initX,
            distanceY: clientY - dragData.initY,
            event
          }
          handler.drag(dragParams)
          contextComponent.$emit('drag', dragParams)
          options.drag(dragParams)
        }

        function mouseupHandler (event) {
          let { clientX, clientY } = event

          let cancelled = false
          let dragParams = {
            distanceX: clientX - dragData.initX,
            distanceY: clientY - dragData.initY,
            cancel: () => {
              cancelled = true
            },
            event
          }
          handler.drag({ ...dragParams, last: true })
          contextComponent.$emit('dragend', dragParams)
          options.dragend(dragParams)
          handler.end(
            cancelled
              ? {
                distanceX: 0,
                distanceY: 0,
                event
              }
              : dragParams
          )

          if (isNativeDrag) {
            if (isFirefox) {
              window.removeEventListener('dragover', mouseMoveHandler)
            } else {
              el.removeEventListener('drag', mouseMoveHandler)
            }
            el.removeEventListener('dragend', mouseupHandler)
          } else {
            window.removeEventListener('mousemove', mouseMoveHandler)
            window.removeEventListener('mouseup', mouseupHandler)
          }
          window.removeEventListener('selectstart', selectStartHandler)
        }

        // TODO: 非IE下面不用移除选区
        window.getSelection().removeAllRanges()
        window.addEventListener('selectstart', selectStartHandler)

        if (isNativeDrag) {
          if (isFirefox) {
            // Firefox dragevent 里面的鼠标坐标是 0
            // https://bugzilla.mozilla.org/show_bug.cgi?id=505521
            window.addEventListener('dragover', mouseMoveHandler)
          } else {
            el.addEventListener('drag', mouseMoveHandler)
          }
          el.addEventListener('dragend', mouseupHandler)
        } else {
          window.addEventListener('mousemove', mouseMoveHandler)
          window.addEventListener('mouseup', mouseupHandler)
        }
      }
    }

    el.addEventListener(
      isNativeDrag ? 'dragstart' : 'mousedown',
      dragData.mousedownHandler
    )
    el.__dragData__ = dragData
  }
}

function isSpecialSyntax (value) {
  return isString(value) && value.indexOf(config.get('drag.prefix')) === 0
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
 * drag 指令也可以随时关闭 drag 功能，只需要传入值为 false 的 draggable 参数即可：
 *
 * ```html
 * <div v-drag="{targets: ['target1', 'target2'], type: 'translate', draggable: false}"></div>
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

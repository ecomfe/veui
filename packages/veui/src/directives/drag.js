import {
  noop,
  isObject,
  isFunction,
  find,
  get,
  keys,
  isString,
  isEqual,
  difference,
  omit
} from 'lodash'
import { getNodes } from '../utils/context'
import BaseHandler from './drag/BaseHandler'
import TranslateHandler from './drag/TranslateHandler'
import config from '../managers/config'

config.defaults({
  'drag.prefix': '@'
})

const HANDLERS = {}

export function registerHandler (name, Handler) {
  if (!(Handler.prototype instanceof BaseHandler)) {
    throw new TypeError('The handler class must derive from `BaseHandler`.')
  }
  HANDLERS[name] = Handler
}

registerHandler('translate', TranslateHandler)

function clear (el) {
  let dragData = el.dragData
  if (!dragData) {
    return
  }

  dragData.handler.destroy()
  el.removeEventListener('mousedown', dragData.mousedownHandler)
  el.dragData = null
}

function parseParams (el, { arg, value, modifiers }, vnode) {
  // 解析 target
  let targets = []
  if (arg) {
    targets = arg.split(',')
  } else {
    targets = get(value, 'targets', [])
  }

  // 解析 type
  let type = find(keys(HANDLERS), t => modifiers[t])
  // 如果 modifiers 里面没有 type，就到 value 里面去找
  if (!type) {
    type = get(value, 'type')
  }

  // 解析 draggable
  let draggable = get(value, 'draggable', true)

  // 解析 containment
  let containment = get(value, 'containment')
  // 如果 containment 不是特殊配置，也不是 object ，或者是 object ，
  // 但是没有完整的 top 、 left 、 width 、 height 属性，
  // 就要看看用 containment 能不能选出 DOM Element 了。
  function isSpecialSyntax (value) {
    return isString(value) && value.indexOf(config.get('drag.prefix')) === 0
  }
  function isRect (value) {
    return (
      isObject(containment) &&
      containment.hasOwnProperty('top') &&
      containment.hasOwnProperty('left') &&
      containment.hasOwnProperty('width') &&
      containment.hasOwnProperty('height')
    )
  }
  if (!isSpecialSyntax(containment) && !isRect(containment)) {
    containment = getNodes(containment, vnode.context)
    containment = get(containment, '[0]', null)
  }

  // 解析 axis
  let axis = find(['x', 'y'], item => modifiers[item])
  if (!axis) {
    axis = get(value, 'axis')
  }

  function parseFn (name) {
    let fn = get(value, name, noop)
    return isFunction(fn) ? fn : noop
  }

  // 解析 drag 系列回调函数
  let dragstart = parseFn('dragstart')
  let drag = parseFn('drag')
  let dragend = parseFn('dragend')

  // ready 回调
  let ready = parseFn('ready')

  return {
    targets,
    type,
    draggable,
    containment,
    axis,
    dragstart,
    drag,
    dragend,
    ready
  }
}

function refresh (el, { modifiers, value, oldValue, arg }, vnode) {
  const params = parseParams(el, { arg, value, modifiers }, vnode)

  const oldParams = el.dragOldParams
  // 如果参数没发生变化，就不要刷新了
  if (
    difference(get(params, 'targets', []), get(oldParams, 'targets', []))
      .length === 0 &&
    isEqual(omit(params, 'targets'), omit(oldParams, 'targets'))
  ) {
    return
  }
  el.dragOldParams = params

  if (el.dragData) {
    el.dragData.handler.setOptions(params)
  } else {
    let contextComponent = vnode.context
    let handler = null
    if (HANDLERS[params.type]) {
      let Handler = HANDLERS[params.type]
      handler = new Handler(params, contextComponent)
    } else {
      handler = new BaseHandler(params, contextComponent)
    }

    params.ready({ reset: () => handler.reset() })

    let dragData = {
      dragging: false,
      initX: 0,
      initY: 0,
      handler,

      mousedownHandler (event) {
        if (!params.draggable || dragData.dragging) {
          return
        }

        let { clientX, clientY } = event
        dragData.dragging = true
        dragData.initX = clientX
        dragData.initY = clientY
        contextComponent.$emit('dragstart', { event })
        handler.start({ event })
        params.dragstart({ event })

        function selectStartHandler (e) {
          e.preventDefault()
        }

        function mouseMoveHandler (event) {
          let { clientX, clientY } = event
          if (!dragData.dragging) {
            return
          }

          let dragParams = {
            distanceX: clientX - dragData.initX,
            distanceY: clientY - dragData.initY,
            event
          }
          contextComponent.$emit('drag', dragParams)
          handler.drag(dragParams)
          params.drag(dragParams)
        }

        function mouseupHandler (event) {
          dragData.dragging = false

          let { clientX, clientY } = event

          let dragParams = {
            distanceX: clientX - dragData.initX,
            distanceY: clientY - dragData.initY,
            event
          }
          contextComponent.$emit('dragend', dragParams)
          handler.end(dragParams)
          params.dragend(dragParams)

          window.removeEventListener('mousemove', mouseMoveHandler)
          window.removeEventListener('mouseup', mouseupHandler)
          window.removeEventListener('selectstart', selectStartHandler)
        }

        // TODO: 非IE下面不用移除选区
        document.getSelection().removeAllRanges()
        window.addEventListener('selectstart', selectStartHandler)

        window.addEventListener('mousemove', mouseMoveHandler)
        window.addEventListener('mouseup', mouseupHandler)
      }
    }

    el.addEventListener('mousedown', dragData.mousedownHandler)
    el.dragData = dragData
  }
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

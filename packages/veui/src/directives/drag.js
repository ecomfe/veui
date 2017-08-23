import { noop, isObject, isFunction, find, pick, get } from 'lodash'
import { getNodes } from '../utils/context'

let computedStyle = getComputedStyle(document.body)
const TRANSFORM_ACCESSOR = find(
  ['transform', '-ms-transform', '-moz-transform', '-webkit-transform'],
  accessor => (accessor in computedStyle)
)

function getComputedTransform (elm) {
  return getComputedStyle(elm)[TRANSFORM_ACCESSOR]
}

class TranslateHandler {

  refs = []

  context = null

  containment = null

  oldStyles = []

  elms = []

  initStyles = []

  initTransforms = []

  initPositions = []

  axis = null

  tempStyle = [
    // 禁掉文本选择
    'user-select:none;-ms-user-select:none;-webkit-user-select:none;-moz-user-select:none;',
    // 去掉动画
    'transition:unset;',
    'animation:unset;-ms-animation:unset;-webkit-animation:unset;-moz-animation:unset'
  ].join('')

  constructor (options, context) {
    this.$options = options
    this.context = context
  }

  start () {
    // oldStyles 仅初始化一次
    if (this.oldStyles.length === 0) {
      this.elms = this.$options.targets.reduce((prev, cur) => {
        prev.push(...getNodes(cur, this.context))
        return prev
      }, [])
      this.oldStyles = this.elms.map(elm => elm.getAttribute('style') || '')
    }

    this.elms.forEach((elm, index) => {
      let oldStyle = this.oldStyles[index]
      let initTransform = getComputedTransform(elm)
      this.initTransforms[index] = initTransform === 'none' ? '' : getComputedTransform(elm)
      this.initStyles[index] = `${oldStyle ? oldStyle + ';' : ''};${this.tempStyle}`

      let rect = elm.getBoundingClientRect()
      this.initPositions[index] = rect
    })
  }

  drag ({ distanceX, distanceY }) {
    this.move(distanceX, distanceY, this.initStyles)
  }

  end ({ distanceX, distanceY }) {
    this.move(distanceX, distanceY, this.oldStyles)
    this.initTransforms = []
    this.initStyles = []
  }

  move (distanceX, distanceY, prevStyles) {
    // 统一转换成 { left: ..., top: ..., width: ..., height: ... } 形式的 rect
    let constraint = null
    if (this.$options.containment && this.$options.containment.nodeType) {
      constraint = pick(this.$options.containment.getBoundingClientRect(), ['top', 'left', 'right', 'bottom'])
      constraint.width = constraint.right - constraint.left
      constraint.height = constraint.bottom - constraint.top
    } else if (this.$options.containment === window) {
      constraint = {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight
      }
    } else {
      constraint = this.$options.containment
    }

    this.elms.forEach((elm, index) => {
      let prevStyle = prevStyles[index]
      let initTransform = this.initTransforms[index]
      let initPosition = this.initPositions[index]

      let realDistanceX = distanceX
      let realDistanceY = distanceY
      let offsetWidth = elm.offsetWidth
      let offsetHeight = elm.offsetHeight
      if (constraint) {
        if (!this.$options.axis || this.$options.axis === 'y') {
          // 从上面超出范围了
          if (initPosition.top + realDistanceY <= constraint.top) {
            realDistanceY = constraint.top - initPosition.top
          }
          // 从下面超出范围了
          if (initPosition.top + offsetHeight + realDistanceY > constraint.top + constraint.height) {
            realDistanceY = constraint.top + constraint.height - (initPosition.top + offsetHeight)
          }
        } else {
          realDistanceY = 0
        }

        if (!this.$options.axis || this.$options.axis === 'x') {
          // 从左边超出范围了
          if (initPosition.left + realDistanceX < constraint.left) {
            realDistanceX = constraint.left - initPosition.left
          }
          // 从右边超出范围了
          if (initPosition.left + offsetWidth + realDistanceX > constraint.left + constraint.width) {
            realDistanceX = constraint.left + constraint.width - (initPosition.left + offsetWidth)
          }
        } else {
          realDistanceX = 0
        }
      }
      elm.setAttribute('style', `${prevStyle};${TRANSFORM_ACCESSOR}:${initTransform} translate(${realDistanceX}px,${realDistanceY}px)`)
    })
  }

  destroy () {
    // 恢复最初的样式
    this.elms.forEach((elm, index) => {
      let oldStyle = this.oldStyles[index]
      elm.setAttribute('style', oldStyle)
    })
  }
}

function clear (el) {
  let dragData = el.dragData
  if (!dragData) {
    return
  }

  dragData.handler.destroy()
  el.removeEventListener('mousedown', dragData.mousedownHandler)
  el.dragData = null
}

const AVAILABLE_TYPES = ['translate']
function parseParams (el, { arg, value, modifiers }, vnode) {
  // 解析 target
  let targets = []
  if (arg) {
    targets = arg.split(',')
  } else {
    targets = get(value, 'targets', [])
  }

  // 解析 type
  let type = find(AVAILABLE_TYPES, t => modifiers[t])
  // 如果 modifiers 里面没有 type，就到 value 里面去找
  if (!type) {
    type = get(value, 'type')
  }

  // 解析 draggable
  let draggable = get(value, 'draggable', true)

  // 解析 containment
  let containment = get(value, 'containment')
  if (containment !== window &&
    (
      !isObject(containment) ||
      !containment.hasOwnProperty('top') ||
      !containment.hasOwnProperty('left') ||
      !containment.hasOwnProperty('width') ||
      !containment.hasOwnProperty('height')
    )
  ) {
    containment = getNodes(containment, vnode.context)
    containment = get(containment, '[0]', null)
  }

  // 解析 axis
  let axis = find(['x', 'y'], item => modifiers[item])
  if (!axis) {
    axis = get(value, 'axis')
  }

  // 解析 drag 系列回调函数
  function parseDragFn (name) {
    let fn = get(value, name, noop)
    return isFunction(fn) ? fn : noop
  }
  let dragstart = parseDragFn('dragstart')
  let drag = parseDragFn('drag')
  let dragend = parseDragFn('dragend')

  return {
    targets,
    type,
    draggable,
    containment,
    axis,
    dragstart,
    drag,
    dragend
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
 * 指定要使用的拖动处理器（目前仅支持 translate），通过 value 并借助 vue 的 refs 来指定目标元素：
 *
 * ```html
 * <p ref="target1"></p>
 * <p ref="target2"></p>
 * <div v-drag:translate="['target1', 'target2']"></div>
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
 * <div v-drag:translate="{targets: ['content'], type: 'translate', containment: {left: 0, top: 0, width: 100, height: 100}}"></div>
 * ```
 *
 * 也可以是一个 DOM 节点或者 ref 指向的节点：
 *
 * ```html
 * <div v-drag:translate="{targets: ['content'], type: 'translate', containment: body}"></div>
 * ```
 *
 * 可以通过传递 axis 参数来限定拖动的方向，x 表明在水平方向拖动，y 表示在垂直方向拖动：
 *
 * ```html
 * <div v-drag:translate="{targets: ['content'], type: 'translate', axis: 'x'"></div>
 * ```
 *
 * 通过将 draggable 的值切换为 false，可以销毁之前设置的拖动处理器，将涉及到的 DOM 元素的样式都设置为原样。
 */
export default {
  componentUpdated (el, { modifiers, value, arg }, vnode) {
    clear(el)

    const contextComponent = vnode.context
    const params = parseParams(el, { arg, value, modifiers }, vnode)
    if (!params.draggable) {
      return
    }

    let handler = null
    if (params.type === 'translate') {
      handler = new TranslateHandler(params, contextComponent)
    } else {
      handler = { start: noop, drag: noop, end: noop, destroy: noop }
    }

    const dragData = {
      dragging: false,
      initX: 0,
      initY: 0,
      handler,

      mousedownHandler (event) {
        const { clientX, clientY } = event
        if (dragData.dragging) {
          return
        }

        dragData.dragging = true
        dragData.initX = clientX
        dragData.initY = clientY
        contextComponent.$emit('dragstart', { event })
        handler.start({ event })

        function selectStartHandler (e) {
          e.preventDefault()
        }

        function mouseMoveHandler (event) {
          const { clientX, clientY } = event
          if (!dragData.dragging) {
            return
          }

          let params = {
            distanceX: clientX - dragData.initX,
            distanceY: clientY - dragData.initY,
            event
          }
          contextComponent.$emit('drag', params)
          handler.drag(params)
        }

        function mouseupHandler (event) {
          dragData.dragging = false

          let { clientX, clientY } = event

          let params = {
            distanceX: clientX - dragData.initX,
            distanceY: clientY - dragData.initY,
            event
          }
          contextComponent.$emit('dragend', params)
          handler.end(params)

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
  },
  unbind: clear
}

import { noop, isArray, isObject, find } from 'lodash'
import { getNodes } from '../utils/context'

const computedStyle = getComputedStyle(document.body)
const TRANSFORM_ACCESSOR = find(
  ['transform', '-ms-transform', '-moz-transform', '-webkit-transform'],
  accessor => (accessor in computedStyle)
)

function getComputedTransform (elm) {
  return getComputedStyle(elm)[TRANSFORM_ACCESSOR]
}

class TranslateHandler {

  oldStyles = []

  refs = []

  context = null

  elms = []

  initStyles = []

  initTransforms = []

  tempStyle = [
    // 禁掉文本选择
    'user-select:none;-ms-user-select:none;-webkit-user-select:none;-moz-user-select:none;',
    // 去掉动画
    'transition:unset;',
    'animation:unset;-ms-animation:unset;-webkit-animation:unset;-moz-animation:unset'
  ].join('')

  constructor (refs, context) {
    this.refs = refs
    this.context = context
  }

  start () {
    // oldStyles 仅初始化一次
    if (this.oldStyles.length === 0) {
      this.elms = this.refs.reduce((prev, cur) => {
        prev.push(...getNodes(cur, this.context))
        return prev
      }, [])
      this.oldStyles = this.elms.map(elm => elm.getAttribute('style'))
    }

    this.elms.forEach((elm, index) => {
      let oldStyle = this.oldStyles[index]
      this.initTransforms[index] = getComputedTransform(elm)
      this.initStyles[index] = `${oldStyle};${this.tempStyle}`
    })
  }

  drag ({ distanceX, distanceY }) {
    this.elms.forEach((elm, index) => {
      let initStyle = this.initStyles[index]
      let initTransform = this.initTransforms[index]
      elm.setAttribute('style', `${initStyle};${TRANSFORM_ACCESSOR}:${initTransform} translate(${distanceX}px,${distanceY}px)`)
    })
  }

  end ({ distanceX, distanceY }) {
    this.elms.forEach((elm, index) => {
      let oldStyle = this.oldStyles[index]
      let initTransform = this.initTransforms[index]
      elm.setAttribute('style', `${oldStyle};${TRANSFORM_ACCESSOR}:${initTransform} translate(${distanceX}px,${distanceY}px)`)
    })
    this.initTransforms = []
    this.initStyles = []
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
  const dragData = el.dragData
  if (!dragData) {
    return
  }

  dragData.handler.destroy()
  el.removeEventListener('mousedown', dragData.mousedownHandler)
  el.dragData = null
}

function parseParams (el, { arg, value }) {
  const targets = []
  let type = null
  let draggable = true

  if (isArray(value)) {
    targets.push(...value)
    type = arg
  } else if (isObject(value)) {
    targets.push(...(value.targets || []))
    type = value.type
    draggable = value.draggable !== false
  }

  return {
    targets,
    type,
    draggable
  }
}

/**
 * drag 指令基本使用方式如下：
 *
 * <div v-drag></div>
 *
 * 在拖动过程中，drag 指令会依次向当前组件 context 发送 dragstart、drag、dragend 事件，
 * 并带上拖动距离作为参数，在当前组件中可以监听这些事件：
 *
 * this.$on('dragstart', ({ event }) => { ... })
 * this.$on('drag', ({ event, distanceX, distanceY }) => { ... })
 * this.$on('dragend', ({ event, distanceX, distanceY }) => { ... })
 *
 * 在各个事件的回调函数中，可以对目标 DOM 元素进行操作，从而达到拖动等效果。
 *
 * drag 指令内部也提供了一个默认的拖动处理器，借助 translate 来移动目标元素。可以通过指令的 arg
 * 指定要使用的拖动处理器（目前仅支持 translate），通过 value 并借助 vue 的 refs 来指定目标元素：
 *
 * <p ref="target1"></p>
 * <p ref="target2"></p>
 * <div v-drag:translate="['target1', 'target2']"></div>
 *
 * drag 指令也可以随时关闭 drag 功能，只需要传入值为 false 的 draggable 参数即可：
 *
 * <div v-drag="{targets: ['target1', 'target2'], type: 'translate', draggable: false}"></div>
 *
 * 通过将 draggable 的值切换为 false，可以销毁之前设置的拖动处理器，将涉及到的 DOM 元素的样式都设置为原样。
 */
export default {
  componentUpdated (el, { modifiers, value, arg }, vnode) {
    clear(el)

    const contextComponent = vnode.context
    const params = parseParams(el, { arg, value })
    if (!params.draggable) {
      return
    }

    let handler = null
    if (params.type === 'translate') {
      handler = new TranslateHandler(params.targets, contextComponent)
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

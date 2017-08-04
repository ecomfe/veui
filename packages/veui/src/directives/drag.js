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

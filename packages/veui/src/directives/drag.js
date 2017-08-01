import { noop, isArray, isObject } from 'lodash'
import { getNodes } from '../utils/context'

function checkAccessor (accessorName, arr) {
  if (accessorName in computedStyle) {
    arr.push(accessorName)
  }
}

const a = document.createElement('a')
const computedStyle = getComputedStyle(a)

const TRANSFORM_ACCESSORS = []
const TRANSLATE_ACCESSORS = ['translate']

checkAccessor('transform', TRANSFORM_ACCESSORS)
checkAccessor('-ms-transform', TRANSFORM_ACCESSORS)
checkAccessor('-moz-transform', TRANSFORM_ACCESSORS)
checkAccessor('-webkit-transform', TRANSFORM_ACCESSORS)

function getTransform (style) {
  for (let i = 0, il = TRANSFORM_ACCESSORS.length; i < il; ++i) {
    let transformStr = style[TRANSFORM_ACCESSORS[i]]
    if (transformStr) {
      return transformStr
    }
  }

  return ''
}

function setTransform (elm, transformStr, { override = false }) {
  elm.style[TRANSFORM_ACCESSORS[0]] = override
    ? transformStr
    : `${getTransform(getComputedStyle(elm))} ${transformStr}`
}

class TranslateHandler {

  initX = 0

  initY = 0

  oldStyles = []

  refs = []

  context = null

  elms = []

  constructor (refs, context) {
    this.refs = refs
    this.context = context
  }

  start () {
    if (this.oldStyles.length === 0) {
      this.elms = this.refs.reduce((prev, cur) => {
        prev.push(...getNodes(cur, this.context))
        return prev
      }, [])
      this.oldStyles = this.elms.map(elm => getTransform(getComputedStyle(elm)))
    }
  }

  drag ({ distanceX, distanceY }) {
    this.setTranslate(this.initX + distanceX, this.initY + distanceY)
  }

  end ({ distanceX, distanceY }) {
    this.initX += distanceX
    this.initY += distanceY
  }

  setTranslate (x, y) {
    this.elms.forEach((elm, index) => {
      let oldStyle = this.oldStyles[index]
      setTransform(elm, `${oldStyle} ${TRANSLATE_ACCESSORS[0]}(${x}px,${y}px)`, { override: true })
    })
  }
}

function clear (el) {
  const dragData = el.dragData
  if (!dragData) {
    return
  }

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
      handler = { start: noop, drag: noop, end: noop }
    }

    const dragData = {
      dragging: false,
      initX: 0,
      initY: 0,

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

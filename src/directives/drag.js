import { keys } from 'lodash'

export default {
  bind (el, { modifiers }, vnode) {
    const contextComponent = vnode.context
    const modifierList = keys(modifiers)

    const dragData = {
      dragging: false,
      statusKey: modifierList[0],
      distanceXKey: modifierList[1],
      distanceYKey: modifierList[2],
      initX: 0,
      initY: 0,

      mousedownHandler ({ clientX, clientY }) {
        if (dragData.dragging) {
          return
        }

        dragData.dragging = true
        dragData.initX = clientX
        dragData.initY = clientY
        contextComponent.$emit('dragstart')

        function selectstarthandler (e) {
          e.preventDefault()
        }

        function mousemoveHandler ({ clientX, clientY }) {
          if (!dragData.dragging) {
            return
          }

          contextComponent.$emit('drag', {
            distanceX: clientX - dragData.initX,
            distanceY: clientY - dragData.initY
          })
        }

        function mouseupHandler () {
          dragData.dragging = false
          contextComponent.$emit('dragend', false)
          window.removeEventListener('mousemove', mousemoveHandler)
          window.removeEventListener('mouseup', mouseupHandler)
          window.removeEventListener('selectstart', selectstarthandler)
        }

        // TODO: 非IE下面不用移除选区
        document.getSelection().removeAllRanges()
        window.addEventListener('selectstart', selectstarthandler)

        window.addEventListener('mousemove', mousemoveHandler)
        window.addEventListener('mouseup', mouseupHandler)
      }
    }

    el.addEventListener('mousedown', dragData.mousedownHandler)
    el.dragData = dragData
  },
  unbind (el) {
    const dragData = el.dragData
    el.removeEventListener('mousedown', dragData.mousedownHandler)
    el.dragData = null
  }
}

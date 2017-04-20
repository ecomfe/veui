export default {
  bind (el, { modifiers }, vnode) {
    const contextComponent = vnode.context

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
        contextComponent.$emit('dragstart', { originEvent: event })

        function selectstarthandler (e) {
          e.preventDefault()
        }

        function mousemoveHandler (event) {
          const { clientX, clientY } = event
          if (!dragData.dragging) {
            return
          }

          contextComponent.$emit('drag', {
            distanceX: clientX - dragData.initX,
            distanceY: clientY - dragData.initY,
            originEvent: event
          })
        }

        function mouseupHandler (event) {
          dragData.dragging = false
          contextComponent.$emit('dragend', { originEvent: event })
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

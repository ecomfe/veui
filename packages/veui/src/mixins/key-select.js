import { findIndex } from 'lodash'
import { getFocusable } from '../utils/dom'

export default {
  methods: {
    navigate (forward = true) {
      let focusable = getFocusable(this.$refs.box)
      let length = focusable.length
      if (!length) {
        return
      }

      let index = findIndex(focusable, elem => elem === document.activeElement)
      if (index === -1) {
        focusable[0].focus()
        return
      }

      focusable[(index + length + (forward ? 1 : -1)) % length].focus()
    },
    handleKeydown (e) {
      let passive = false
      switch (e.key) {
        case 'Esc':
        case 'Escape':
        case 'Left':
        case 'ArrowLeft':
          this.expanded = false
          break
        case 'Up':
        case 'ArrowUp':
          this.navigate(false)
          break
        case 'Down':
        case 'ArrowDown':
          this.navigate()
          break
        default:
          passive = true
          break
      }
      if (!passive) {
        e.stopPropagation()
        e.preventDefault()
      }
    }
  }
}

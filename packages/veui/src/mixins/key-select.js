import { findIndex, find } from 'lodash'
import { getFocusable, hasClass, toggleClass } from '../utils/dom'

const isActive = (elem, focusClass) => focusClass
  ? hasClass(elem, focusClass)
  : elem === document.activeElement

const focus = (focusableList, index, focusClass) => {
  if (focusClass) {
    focusableList.forEach(
      (elem, idx) => toggleClass(elem, focusClass, index === idx)
    )
  } else {
    focusableList[index].focus()
  }
}

export default {
  props: {
    // 用这个 class 来模拟 focus，不定义则默认原生focus
    focusClass: String
  },
  methods: {
    // 方便覆盖
    getContainerOfFocusable () {
      return this.$refs.box
    },
    getFocusable () {
      let container = this.getContainerOfFocusable()
      return container ? getFocusable(container) : []
    },
    clearFocusClass () {
      return focus(this.getFocusable(), -1, this.focusClass)
    },
    getCurrentActiveElement () {
      return find(
        this.getFocusable(),
        elem => isActive(elem, this.focusClass)
      )
    },
    navigate (forward = true) {
      let focusable = this.getFocusable()
      let length = focusable.length
      if (!length) {
        return
      }

      let index = findIndex(focusable, elem => isActive(elem, this.focusClass))
      index = index === -1
        ? 0
        : (index + length + (forward ? 1 : -1)) % length
      focus(focusable, index, this.focusClass)
    },
    handleKeydown (e) {
      let passive = false
      switch (e.key) {
        case 'Esc':
        case 'Escape':
        case 'Left':
        case 'ArrowLeft':
          this.expanded = false
          if (this.focusClass) {
            this.clearFocusClass()
          }
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

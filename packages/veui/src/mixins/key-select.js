import { findIndex, find } from 'lodash'
import { getFocusable, hasClass, toggleClass } from '../utils/dom'
import config from '../managers/config'

const isActive = (elem, focusClass) => focusClass
  ? hasClass(elem, focusClass)
  : elem === document.activeElement

const focusElement = (focusableList, index, focusClass) => {
  if (focusClass) {
    focusableList.forEach(
      (elem, idx) => toggleClass(elem, focusClass, index === idx)
    )
  } else {
    focusableList[index].focus()
  }
}

config.defaults({
  'keySelect.focusClass': 'focus-visible'
})

const createKeySelect = ({ focus }) => ({
  computed: {
    focusClass () {
      return focus ? null : config.get('keySelect.focusClass')
    }
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
      return focusElement(this.getFocusable(), -1, this.focusClass)
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
      focusElement(focusable, index, this.focusClass)
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
})

export default createKeySelect({ focus: true })
export { createKeySelect }

import { findIndex, find, get } from 'lodash'
import { getFocusable, toggleClass, matches } from '../utils/dom'
import config from '../managers/config'

function isActive (elem, focusSelector) {
  return focusSelector
    ? matches(elem, focusSelector)
    : elem === document.activeElement
}

function focusElement (focusableList, index, focusSelector) {
  if (focusSelector) {
    focusableList.forEach((elem, idx) => {
      toggleSelector(elem, focusSelector, index === idx)
    })
  } else {
    focusableList[index].focus()
  }

  focusableList[index].scrollIntoView({ behavior: 'smooth' })
}

function toggleSelector (elem, selector, force) {
  if (selector.charAt(0) === '.') {
    toggleClass(elem, selector.slice(1), force)
    return
  }

  let [, attr] = selector.match(/^\[([^\]]+)\]$/)
  if (attr) {
    if (elem.hasAttribute(attr) || force === false) {
      elem.removeAttribute(attr)
    } else if (!elem.hasAttribute(attr) || force === true) {
      elem.setAttribute(attr, '')
    }
  } else {
    throw new Error(
      '[keyselect.focusSelector] only accepts a simple class selector (.foo) or an attribute existence selector ([foo]).'
    )
  }
}

config.defaults({
  'keyselect.focusSelector': '[data-focus-visible-added]'
})

const createKeySelect = ({ useNativeFocus, handlers }) => ({
  computed: {
    focusMode () {
      return typeof useNativeFocus === 'string'
        ? this[useNativeFocus]
        : typeof useNativeFocus === 'function'
          ? useNativeFocus(this)
          : useNativeFocus
    },
    focusSelector () {
      return this.focusMode ? null : config.get('keyselect.focusSelector')
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
    clearfocusSelector () {
      return focusElement(this.getFocusable(), -1, this.focusSelector)
    },
    getCurrentActiveElement () {
      return find(this.getFocusable(), elem =>
        isActive(elem, this.focusSelector)
      )
    },
    navigate (forward = true) {
      let focusable = this.getFocusable()
      let length = focusable.length
      if (!length) {
        return
      }

      let index = findIndex(focusable, elem =>
        isActive(elem, this.focusSelector)
      )
      index = index === -1 ? 0 : (index + length + (forward ? 1 : -1)) % length
      focusElement(focusable, index, this.focusSelector)
    },
    handleKeydown (e) {
      let passive = false
      switch (e.key) {
        case 'Esc':
        case 'Escape':
        case 'Left':
        case 'ArrowLeft':
          this.expanded = false
          if (this.focusSelector) {
            this.clearfocusSelector()
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
          // 先就简单支持下，目前仅用到 tab 和 enter
          let handler = get(handlers, e.key.toLowerCase())
          if (handler) {
            handler.call(this, e)
          }
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

export default createKeySelect({ useNativeFocus: true })
export { createKeySelect }

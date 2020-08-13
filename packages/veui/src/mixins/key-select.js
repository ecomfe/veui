import { findIndex, find, get } from 'lodash'
import {
  getFocusable,
  toggleClass,
  matches,
  scrollIntoView,
  isOverflow
} from '../utils/dom'
import config from '../managers/config'

function isActive (elem, focusSelector) {
  return focusSelector
    ? matches(elem, focusSelector)
    : elem === document.activeElement
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
  watch: {
    expanded (val) {
      if (!val) {
        if (this.focusSelector) {
          this.clearFocusSelector()
        }
      }
    }
  },
  methods: {
    // 方便覆盖
    getFocusableContainer () {
      return this.$refs.box
    },
    getFocusable () {
      let container = this.getFocusableContainer()
      return container ? getFocusable(container) : []
    },
    getCurrentActiveElement () {
      return find(this.getFocusable(), elem =>
        isActive(elem, this.focusSelector)
      )
    },
    navigate (forward = true) {
      this.focusAt(forward)
    },
    focusAt (indexOrDir) {
      let focusable = this.getFocusable()
      let length = focusable.length
      if (!length) {
        return
      }

      let index = indexOrDir
      if (typeof indexOrDir !== 'number') {
        let forward = indexOrDir
        index = findIndex(focusable, elem => isActive(elem, this.focusSelector))
        index =
          index === -1 ? 0 : (index + length + (forward ? 1 : -1)) % length
      }
      this.focusElement(focusable, index)
    },
    clearFocusSelector () {
      return this.focusElement(this.getFocusable(), -1)
    },
    focusElement (focusableList, index) {
      if (this.focusSelector) {
        focusableList.forEach((elem, idx) => {
          toggleSelector(elem, this.focusSelector, index === idx)
        })
      } else {
        focusableList[index].focus()
      }

      if (index !== -1 && isOverflow(this.getFocusableContainer())) {
        scrollIntoView(focusableList[index])
      }
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
        default: {
          // 先就简单支持下，目前仅用到 tab 和 enter
          let handler = get(handlers, e.key.toLowerCase())
          if (handler) {
            handler.call(this, e)
          }
          passive = true
          break
        }
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

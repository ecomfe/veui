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

const useKeySelect = ({
  useNativeFocus,
  handlers,
  expandedKey = 'expanded'
}) => ({
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
  created () {
    this.$watch(expandedKey, val => {
      if (!val) {
        if (this.focusSelector) {
          this.clearFocusSelector()
        }
        this.clearFocusableFilter()
      }
    })
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
    getFilteredFocusable () {
      let focusable = this.getFocusable()
      if (typeof this.focusableFilter === 'function') {
        return focusable.filter(this.focusableFilter)
      }
      return focusable
    },
    clearFocusableFilter () {
      this.focusableFilter = null
    },
    getCurrentActiveElement () {
      return find(this.getFocusable(), elem =>
        isActive(elem, this.focusSelector)
      )
    },
    // 按 DOM 顺序线性导航
    navigate (forward = true) {
      this.focusAt(forward)
    },
    /**
     * 焦点导航到指定的层级， TODO 进一步标准化 data-kbd-xxx 来控制导航？
     * @param {string} levelSelector 指定层级的选择器，如 [data-kbd-level="1"]
     * @param {string} options.targetSelector 进一步指定指定层级中获得焦点的元素，一般用来关闭某个展开后，焦点回到该展开按钮上
     * @param {boolean} options.lock 锁定之后的导航只能在该层级中进行
     */
    navigateToLevel (levelSelector, { targetSelector, lock } = {}) {
      let focusable = this.getFocusable()
      let filter = elem => matches(elem, levelSelector)
      let nextLevel = find(
        focusable,
        elem =>
          filter(elem) && (!targetSelector || matches(elem, targetSelector))
      )
      if (nextLevel) {
        this.focusElement(focusable, nextLevel)
      }
      if (lock) {
        this.focusableFilter = filter
      }
    },
    focusAt (indexOrDirection) {
      let focusable = this.getFilteredFocusable()
      let length = focusable.length
      if (!length) {
        return
      }

      let index = indexOrDirection
      if (typeof indexOrDir !== 'number') {
        let forward = indexOrDirection
        index = findIndex(focusable, elem => isActive(elem, this.focusSelector))
        index =
          index === -1 ? 0 : (index + length + (forward ? 1 : -1)) % length
      }
      this.focusAtIndex(focusable, index)
    },
    clearFocusSelector () {
      return this.focusAtIndex(this.getFocusable(), -1)
    },
    focusAtIndex (focusableList, index) {
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
    focusElement (focusableList, element) {
      focusableList.forEach(elem => {
        toggleSelector(elem, this.focusSelector, element === elem)
      })
      scrollIntoView(element)
    },
    handleKeydown (e) {
      let passive = false
      switch (e.key) {
        case 'Esc':
        case 'Escape':
        case 'Left':
        case 'ArrowLeft':
          this[expandedKey] = false
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

export default useKeySelect({ useNativeFocus: true })
export { useKeySelect }

import { remove, findIndex } from 'lodash'
import { focusIn } from '../utils/dom'
import Vue from 'vue'

class FocusContext {
  /**
   *
   * @param {Element} root Root element for focus context
   * @param {=Element} source Previous focused element
   * @param {=Boolean} trap Whether focus should be trapped inside root
   * @param {=Element} preferred Where we should start searching for focusable elements
   */
  constructor (root, { source, trap = false, preferred }) {
    if (!root) {
      throw new Error('Root must be specified to create a FocusContext instance.')
    }

    this.root = root
    this.source = source
    this.trap = trap
    this.preferred = preferred

    this.outsideStartHandler = () => {
      this.focusAt(-2, true)
    }
    this.outsideEndHandler = () => {
      this.focusAt(1, true)
    }

    this.init()
  }

  /**
   * Initalize a focus context:
   * 1. trap focus events inside `root`
   * 2. focus `root` by default
   */
  init () {
    this.focusAt()

    if (this.trap) {
      let before = document.createElement('div')
      before.tabIndex = 0
      let after = before.cloneNode()

      before.addEventListener('focus', this.outsideStartHandler, true)
      after.addEventListener('focus', this.outsideEndHandler, true)

      this.root.insertBefore(before, this.root.firstChild)
      this.root.appendChild(after)

      this.wardBefore = before
      this.wardAfter = after
    }
  }

  focusAt (index = 0, ignoreAutofocus) {
    Vue.nextTick(() => {
      if (!focusIn(this.preferred || this.root, index, ignoreAutofocus)) {
        this.root.focus()
      }
    })
  }

  destroy () {
    let { trap, source, wardBefore, wardAfter } = this
    if (trap) {
      wardBefore.removeEventListener('focus', this.outsideStartHandler, true)
      wardAfter.removeEventListener('focus', this.outsideEndHandler, true)
      this.root.removeChild(wardBefore)
      this.root.removeChild(wardAfter)
    }
    if (source && typeof source.focus === 'function') {
      this.source = null

      // restore focus in a macro task to prevent
      // triggering events on the original focus
      setTimeout(() => {
        source.focus()
      }, 0)
    }
    this.preferred = null
    this.root = null
  }
}

export class FocusManager {
  /**
   * Global focus history stack
   * @type Array.<FocusContext>
   * @private
   */
  stack = []

  createContext (root, options = {}) {
    let context = new FocusContext(root, options)
    this.stack.push(context)
    return context
  }

  toTop (context) {
    this.detach(context)
    this.stack.push(context)
  }

  detach (context) {
    let stack = this.stack
    let i = findIndex(stack, context)
    if (i === -1) {
      return
    }

    if (i < stack.length - 1) {
      stack[i + 1].source = context.source
    }

    remove(this.stack, item => item === context)
    return context
  }

  remove (context) {
    this.detach(context)
    context.destroy()
  }
}

export default new FocusManager()

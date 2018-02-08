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
    this.root = root
    this.source = source
    this.trap = trap
    this.preferred = preferred

    this.outsideHandler = () => {
      this.focusFirst(true)
    }

    this.init()
  }

  /**
   * Initalize a focus context:
   * 1. trap focus events inside `root`
   * 2. focus `root` by default
   */
  init () {
    this.focusFirst()

    if (this.trap) {
      let ward = document.createElement('div')
      ward.tabIndex = 0
      ward.addEventListener('focus', this.outsideHandler, true)
      this.root.appendChild(ward)
      this.ward = ward
    }
  }

  focusFirst (ignoreFocus) {
    Vue.nextTick(() => {
      if (!focusIn(this.preferred || this.root, ignoreFocus)) {
        this.root.focus()
      }
    })
  }

  destroy () {
    let { trap, source, ward } = this
    if (trap) {
      ward.removeEventListener('focus', this.outsideHandler, true)
    }
    if (source && typeof source.focus === 'function') {
      this.source = null

      // restore focus in a macro task to prevent
      // triggering events on the original focus
      setTimeout(() => {
        source.focus()
      }, 0)
    }
    if (ward) {
      ward.parentElement.removeChild(ward)
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

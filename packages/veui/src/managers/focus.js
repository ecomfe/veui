import { remove, findIndex, last } from 'lodash'
import { focusIn, getFocusable } from '../utils/dom'

class FocusContext {
  /**
   *
   * @param {Element} root Root element for focus context
   * @param {FocusManager} env FocusManager instance that creates this context
   * @param {Element=|FocusContext} source Previous focused element or FocusContext
   * @param {Boolean=} trap Whether focus should be trapped inside root
   * @param {Element=} preferred Where we should start searching for focusable elements
   */
  constructor (root, env, { source, trap = false, preferred }) {
    if (!root) {
      throw new Error(
        'Root must be specified to create a FocusContext instance.'
      )
    }

    this.root = root
    this.env = env
    this.source = source
    this.trap = trap
    this.preferred = preferred

    this.trapHanlder = (e) => {
      if (e.key !== 'Tab') {
        return
      }

      let focusable = getFocusable(this.root)

      if (!focusable.length) {
        return
      }

      if (e.shiftKey) {
        if (e.target === focusable[0]) {
          focusable[focusable.length - 1].focus()
          e.preventDefault()
        }
      } else {
        if (e.target === focusable[focusable.length - 1]) {
          focusable[0].focus()
          e.preventDefault()
        }
      }
    }

    this.init()
  }

  /**
   * Initialize a focus context:
   * 1. trap focus events inside `root`
   * 2. focus `root` by default
   */
  init () {
    if (this.trap) {
      this.root.addEventListener('keydown', this.trapHanlder, true)
    }

    this.focus()
  }

  toTop () {
    this.env.toTop(this)
  }

  focus () {
    setTimeout(() => {
      let target = this.preferred || this.root
      if (target && !focusIn(target, 0)) {
        this.root.focus()
      }
    })
  }

  destroy () {
    let { trap, source } = this
    if (trap) {
      this.root.removeEventListener('keydown', this.trapHanlder, true)
    }
    if (source) {
      this.source = null

      if (
        this.env.trigger !== 'pointer' &&
        typeof source.focus === 'function'
      ) {
        setTimeout(() => {
          source.focus()
        })
      }
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

  /**
   * Latest interaction is triggered by pointer or keyboard
   */
  trigger = 'pointer'

  triggerHandlers = {
    keydown: () => {
      this.trigger = 'keyboard'
    },
    mousedown: () => {
      this.trigger = 'pointer'
    }
  }

  initTriggerHandlers () {
    Object.keys(this.triggerHandlers).forEach((type) => {
      document.addEventListener(type, this.triggerHandlers[type], true, true)
    })
  }

  destroyTriggerHandlers () {
    Object.keys(this.triggerHandlers).forEach((type) => {
      document.removeEventListener(type, this.triggerHandlers[type], true)
    })
  }

  createContext (root, options = {}) {
    if (!this.stack.length) {
      this.initTriggerHandlers()
    }

    let context = new FocusContext(root, this, options)
    this.stack.push(context)
    return context
  }

  toTop (context) {
    this.detach(context)
    context.source = last(this.stack)
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
      context.source = null
    }

    remove(this.stack, (item) => item === context)
    return context
  }

  remove (context) {
    this.detach(context)
    context.destroy()
    if (!this.stack.length) {
      this.destroyTriggerHandlers()
    }
  }
}

export default new FocusManager()

import { remove, findIndex, last } from 'lodash'
import { focusIn } from '../utils/dom'

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

    this.outsideStartHandler = () => {
      this.focusAt(-2, true)
    }
    this.outsideEndHandler = () => {
      this.focusAt(1, true)
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

    // skip wardBefore if trapping
    this.focusAt(this.trap ? 1 : 0)
  }

  focusAt (index = 0, ignoreAutofocus) {
    setTimeout(() => {
      let target = this.preferred || this.root
      if (target && !focusIn(target, index, ignoreAutofocus)) {
        this.root.focus()
      }
    })
  }

  toTop () {
    this.env.toTop(this)
  }

  focus () {
    this.focusAt(this.trap ? 1 : 0)
  }

  destroy () {
    let { trap, source, wardBefore, wardAfter } = this
    if (trap) {
      wardBefore.removeEventListener('focus', this.outsideStartHandler, true)
      wardAfter.removeEventListener('focus', this.outsideEndHandler, true)
      this.root.removeChild(wardBefore)
      this.root.removeChild(wardAfter)
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
  stack = [];

  /**
   * Latest interaction is triggered by pointer or keyboard
   */
  trigger = 'pointer';

  triggerHandlers = {
    keydown: () => {
      this.trigger = 'keyboard'
    },
    mousedown: () => {
      this.trigger = 'pointer'
    }
  };

  initTriggerHandlers () {
    Object.keys(this.triggerHandlers).forEach(type => {
      document.addEventListener(type, this.triggerHandlers[type], true)
    })
  }

  destroyTriggerHandlers () {
    Object.keys(this.triggerHandlers).forEach(type => {
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
    }

    remove(this.stack, item => item === context)
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

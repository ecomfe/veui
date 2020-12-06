import { getScrollbarWidth } from '../utils/dom'

export class ModalManager {
  count = 0

  originalPaddingRight = ''

  originalOverflowY = ''

  unlockCallbacks = []

  open () {
    if (this.count === 0) {
      this.lock()
    }

    this.count++
  }

  close () {
    if (this.count === 0) {
      return
    }

    if (this.count === 1) {
      this.unlock()
    }

    this.count--
  }

  lock () {
    // See https://www.w3.org/TR/CSS22/visufx.html#propdef-overflow
    let { documentElement: html, body } = document

    let htmlOverflowY = getComputedStyle(html).overflowY

    if (htmlOverflowY === 'visible') {
      // overflow of <body> is propagated to the viewport
      // check <body> & lock <html>
      this.onUnlock(lockScroll(body, html))
    } else if (htmlOverflowY === 'hidden') {
      // potential scroll will happen inside <body>
      // check <body> & lock <body>
      this.onUnlock(lockScroll(body))
    } else {
      // overflow of <html> is propagated to the viewport
      // check both & lock both
      this.onUnlock(lockScroll(body))
      this.onUnlock(lockScroll(html))
    }
  }

  onUnlock (fn) {
    this.unlockCallbacks.push(fn)
  }

  unlock () {
    this.unlockCallbacks.forEach(fn => fn())
    this.unlockCallbacks = []
  }
}

/**
 * Lock scroll based on trigger and target element.
 * The trigger element and the target element can be different due to the special
 * behavior for `overflow` on <html> and <body>.
 * We need to set trigger element's `overflow-y` to `hidden` and add an extra `padding-right`
 * for the width of the scrollbar.
 *
 * @param {HTMLElement} trigger the element whose overflow value may trigger scroll
 * @param {HTMLElement} target the element where scrollbar appears
 */
function lockScroll (trigger, target = trigger) {
  let { scrollHeight, clientHeight } = target

  if (scrollHeight <= clientHeight) {
    return () => {}
  }

  let triggerStyle = trigger.style
  let targetStyle = target.style
  let originalOverflowY = triggerStyle.overflowY
  let originalPaddingRight = targetStyle.paddingRight
  let { overflowY } = getComputedStyle(trigger)
  let { paddingRight } = getComputedStyle(target)

  let scrollbarWidth = getScrollbarWidth()
  if (overflowY !== 'hidden') {
    targetStyle.paddingRight = `${parseInt(paddingRight, 10) +
      scrollbarWidth}px`
    triggerStyle.overflowY = 'hidden'

    return () => {
      targetStyle.paddingRight = originalPaddingRight
      triggerStyle.overflowY = originalOverflowY
    }
  }

  return () => {}
}

export default new ModalManager()

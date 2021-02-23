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
      // check both & lock both, order matters because changes made on body will
      // impact scrollHeight for html
      this.onUnlock(lockScroll(html))
      this.onUnlock(lockScroll(body))
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

  let triggerStyle = trigger.getAttribute('style') || ''
  let { overflowY } = getComputedStyle(trigger)
  let isRoot = target === document.documentElement

  if (overflowY !== 'hidden' && (isRoot || overflowY !== 'visible')) {
    let targetStyle = target.getAttribute('style') || ''
    let { paddingRight } = getComputedStyle(target)
    let scrollbarWidth = getScrollbarWidth()

    let newPaddingRight = `${parseInt(paddingRight, 10) + scrollbarWidth}px`
    target.setAttribute(
      'style',
      `${targetStyle};padding-right:${newPaddingRight};overflow-y:hidden`
    )

    return () => {
      trigger.setAttribute('style', triggerStyle)
      target.setAttribute('style', targetStyle)
    }
  }

  return () => {}
}

export default new ModalManager()

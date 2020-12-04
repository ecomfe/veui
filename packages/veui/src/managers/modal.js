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
      this.unlockCallbacks.push(lockScroll(body, html, window.innerHeight))
    } else if (htmlOverflowY === 'hidden') {
      // potential scroll will happen inside <body>
      // check <body> & lock <body>
      this.unlockCallbacks.push(lockScroll(body))
    } else {
      // overflow of <html> is propagated to the viewport
      // check both & lock both
      this.unlockCallbacks.push(lockScroll(body))
      this.unlockCallbacks.push(lockScroll(html, html, window.innerHeight))
    }
  }

  unlock () {
    this.unlockCallbacks.forEach(fn => fn())
    this.unlockCallbacks = []
  }
}

function lockScroll (
  trigger,
  target = trigger,
  clientHeight = trigger.clientHeight
) {
  if (trigger.scrollHeight <= clientHeight) {
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

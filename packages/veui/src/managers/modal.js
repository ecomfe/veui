import { getScrollbarWidth } from '../utils/dom'

export class ModalManager {
  count = 0

  originalPaddingRight = ''

  originalOverflowY = ''

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
    let style = document.body.style
    let computedStyle = getComputedStyle(document.body)
    this.originalPaddingRight = style.paddingRight
    this.originalOverflowY = style.overflowY

    let scrollbarWidth = getScrollbarWidth()
    let isOverflow =
      document.documentElement.clientHeight < document.body.scrollHeight
    let overflowY = computedStyle.overflowY

    if (scrollbarWidth > 0 && (isOverflow || overflowY === 'scroll')) {
      style.paddingRight = `${parseInt(computedStyle.paddingRight, 10) +
        scrollbarWidth}px`
      style.overflowY = 'hidden'
    }
  }

  unlock () {
    let style = document.body.style
    style.paddingRight = this.originalPaddingRight
    style.overflowY = this.originalOverflowY
  }
}

export default new ModalManager()

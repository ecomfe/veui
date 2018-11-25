let scrollbarWidth = null

export function getScrollbarWidth () {
  if (scrollbarWidth !== null) {
    return scrollbarWidth
  }

  let measurer = document.createElement('div')
  measurer.style.cssText = 'height:1px;overflow-y:scroll'
  document.body.appendChild(measurer)
  scrollbarWidth = measurer.offsetWidth - measurer.clientWidth
  document.body.removeChild(measurer)
  return scrollbarWidth
}

export function getElementScrollbarWidth (el, horizontal) {
  if (horizontal) {
    return el.offsetHeight - el.clientHeight
  }
  return el.offsetWidth - el.clientWidth
}

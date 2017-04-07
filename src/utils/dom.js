
export function closest (element, selectors) {
  if (element.closest) {
    return element.closest(selectors)
  }

  // Polyfill from https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
  let matches = (element.document || element.ownerDocument).querySelectorAll(selectors)
  let i

  do {
    i = matches.length
    while (--i >= 0 && matches.item(i) !== element) {}
  } while ((i < 0) && (element = element.parentElement))

  return element
}

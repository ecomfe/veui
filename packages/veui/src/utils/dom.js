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

let needIndeterminatePatch = null

function testIndeterminate () {
  let checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.indeterminate = true
  document.body.appendChild(checkbox)
  checkbox.click()
  let needPatch = !checkbox.checked
  checkbox.parentNode.removeChild(checkbox)
  return needPatch
}

// IE won't trigger change event for indeterminate checkboxes
// Problem see http://stackoverflow.com/questions/33523130/ie-does-not-fire-change-event-on-indeterminate-checkbox-when-you-click-on-it
// A more thorough compatibility fix here:
export function patchIndeterminate (element) {
  if (needIndeterminatePatch == null) {
    needIndeterminatePatch = testIndeterminate()
  }

  if (!needIndeterminatePatch ||
    !element.tagName || element.tagName.toLowerCase() !== 'input' ||
    !element.type || element.type.toLowerCase() !== 'checkbox') {
    return
  }

  // The indeterminate status will already be changed when click event is dispatched
  // so listen to mousedown events for all associated labels
  let indeterminate
  let label = closest(element, 'label')
  let target = label || element
  let targets = label ? [label] : []
  if (element.id) {
    targets = [target, ...document.querySelectorAll(`label[for="${element.id}"]`)]
  }
  targets.forEach(target => {
    target.addEventListener('mousedown', function () {
      indeterminate = element.indeterminate
    })
  })

  // Click on labels will also trigger change events for checkboxes
  element.addEventListener('click', function () {
    if (!indeterminate) {
      return
    }
    element.checked = !element.checked
    let event = document.createEvent('HTMLEvents')
    event.initEvent('change', true, false)
    element.dispatchEvent(event)
  }, false)
}

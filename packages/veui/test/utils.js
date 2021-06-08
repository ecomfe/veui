import { trim } from 'lodash'
import { mount as vueMount } from '@vue/test-utils'

export function mount (component, options = {}) {
  options = {
    ...options,
    sync: false
  }
  return vueMount(component, options)
}

export function wait (timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

export function nextFrame () {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

export async function doubleNextFrame () {
  await nextFrame()
  await nextFrame()
}

export function getStyle (element) {
  let cssText = element.style.cssText || ''
  let arr = cssText.split(';')
  return arr.reduce((obj, item) => {
    if (!item) {
      return obj
    }
    let [key, value] = item.split(':')
    return { ...obj, [trim(key)]: trim(value) }
  }, {})
}

export function normalizeTransform (transform) {
  let el = document.createElement('div')
  el.style.transform = transform
  document.body.appendChild(el)
  let result = getComputedStyle(el).transform
  el.parentElement.removeChild(el)
  return result === 'none' ? 'matrix(1, 0, 0, 1, 0, 0)' : result
}

export function expectTooltip (content, position) {
  const tooltip = document.body.querySelector('.veui-global-tooltip')
  if (content === null) {
    expect(tooltip).to.equal(null)
  } else if (content === false) {
    expect(tooltip.style.display).to.equal('none')
  } else {
    expect(tooltip).to.not.equal(null)
    expect(tooltip.textContent.trim()).to.equal(content)

    if (position) {
      expect(tooltip.getAttribute('x-placement')).to.equal(position)
    }
  }
}

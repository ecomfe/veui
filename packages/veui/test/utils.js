import { trim } from 'lodash'

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

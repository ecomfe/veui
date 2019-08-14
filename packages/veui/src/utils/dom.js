import { findIndex, uniq } from 'lodash'

/**
 *
 * @param {Element} element 参考元素
 * @param {string} selectors 用来查找目标元素的选择器
 * @returns {?Element} 查找到的元素
 */
export function closest (element, selectors) {
  if (element.closest) {
    return element.closest(selectors)
  }

  // Polyfill from https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
  let matches = (element.document || element.ownerDocument).querySelectorAll(
    selectors
  )
  let i

  do {
    i = matches.length
    while (--i >= 0 && matches.item(i) !== element) {}
  } while (i < 0 && (element = element.parentElement))

  return element
}

function testIndeterminate () {
  if (typeof document === 'undefined') {
    return null
  }
  let checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.indeterminate = true
  document.body.appendChild(checkbox)
  checkbox.click()
  let needPatch = !checkbox.checked
  checkbox.parentNode.removeChild(checkbox)
  return needPatch
}

// cache test result for repeated use
let needIndeterminatePatch = testIndeterminate()

// IE won't trigger change event for indeterminate checkboxes
// Problem see http://stackoverflow.com/questions/33523130/ie-does-not-fire-change-event-on-indeterminate-checkbox-when-you-click-on-it
// A more thorough compatibility fix here:
export function patchIndeterminate (element) {
  if (
    !needIndeterminatePatch ||
    !element.tagName ||
    element.tagName.toLowerCase() !== 'input' ||
    !element.type ||
    element.type.toLowerCase() !== 'checkbox'
  ) {
    return
  }

  // The indeterminate status will already be changed when click event is dispatched
  // so listen to mousedown events for all associated labels
  let indeterminate
  let label = closest(element, 'label')
  let target = label || element
  let targets = label ? [label] : []
  if (element.id) {
    targets = [
      target,
      ...document.querySelectorAll(`label[for="${element.id}"]`)
    ]
  }
  targets.forEach(target => {
    target.addEventListener('mousedown', function () {
      indeterminate = element.indeterminate
    })
  })

  // Click on labels will also trigger change events for checkboxes
  element.addEventListener(
    'click',
    function () {
      if (!indeterminate) {
        return
      }
      element.checked = !element.checked
      let event = document.createEvent('HTMLEvents')
      event.initEvent('change', true, false)
      element.dispatchEvent(event)
    },
    false
  )
}

/**
 * 判断两个元素是否存在父子关系。
 * IE9 的 SVGSVGElement 上没有 contains 方法，做下 hack 。
 *
 * @param {Element} parentElem 父元素
 * @param {Element} childElem 子元素
 * @return {boolean}
 */
export function contains (parentElem, childElem) {
  return parentElem.contains
    ? parentElem.contains(childElem)
    : document.body.contains.call(parentElem, childElem)
}

/**
 * 判断一个元素是否匹配某个指定的选择器。

 * @param {Element} elem 指定元素
 * @param {string} selector 选择器字符串
 * @return {boolean} 是否匹配
 */
export function matches (elem, selector) {
  return (
    elem.matches ||
    elem.matchesSelector ||
    elem.mozMatchesSelector ||
    elem.msMatchesSelector ||
    elem.oMatchesSelector ||
    elem.webkitMatchesSelector
  ).call(elem, selector)
}

/**
 * 获取离指定元素最近的可滚动的父级元素
 *
 * @param {Element} elem 指定元素
 * @param {Boolean} includeSelf 是否在自身可滚动时直接返回，默认为 `false`
 * @return {Element} 最近的可滚动父级元素
 */
export function getScrollParent (elem, includeSelf = false) {
  if (!elem) {
    return null
  }
  let current = includeSelf ? elem : elem.parentNode
  if (!current) {
    return null
  }
  if (current.scrollHeight > current.clientHeight) {
    return current
  }
  return getScrollParent(current, false)
}

const FOCUSABLE_SELECTOR = `
a[href]:not([tabindex='-1']),
area[href]:not([tabindex='-1']),
input:not([disabled]):not([tabindex='-1']),
select:not([disabled]):not([tabindex='-1']),
textarea:not([disabled]):not([tabindex='-1']),
button:not([disabled]):not([tabindex='-1']),
iframe:not([tabindex='-1']),
[tabindex]:not([tabindex='-1']),
[contentEditable=true]:not([tabindex='-1'])`

/**
 * 获取目标元素下所有可以获取焦点的元素
 *
 * @param {Element} elem 需要查找的目标元素
 * @returns {Array.<Element>} 可以获取焦点的元素数组
 */
export function getFocusable (elem) {
  return [...elem.querySelectorAll(FOCUSABLE_SELECTOR)]
}

/**
 * 将焦点移入指定元素内的第一个可聚焦的元素
 *
 * @param {Element} elem 需要查找的指定元素
 * @param {number=} index 聚焦元素在可聚焦元素的位置
 * @param {Boolean=} ignoreAutofocus 是否忽略 autofocus
 * @returns {Boolean} 是否找到可聚焦的元素
 */
export function focusIn (elem, index = 0, ignoreAutofocus) {
  if (!ignoreAutofocus) {
    let auto =
      elem.querySelector('[data-autofocus]') ||
      elem.querySelector('[autofocus]')
    if (auto) {
      focus(auto)
      return true
    }
  }

  if (index === 0) {
    let first = elem.querySelector(FOCUSABLE_SELECTOR)
    if (first) {
      focus(first)
      return true
    }
  }

  let focusable = [...elem.querySelectorAll(FOCUSABLE_SELECTOR)]
  let count = focusable.length
  if (!count) {
    return false
  }

  focus(focusable[(index + count) % count])
  return true
}

/**
 * 聚焦到前/后第指定个可聚焦元素
 *
 * @param {HTMLElement} elem 起始元素
 * @param {number} step 偏移量
 */
function focusNav (elem, step) {
  let focusable = getFocusable(document.body)
  let index = findIndex(focusable, el => el === elem)
  if (index !== -1) {
    let next = focusable[index + step]
    if (next) {
      next.focus()
    }
  }
}

/**
 * 聚焦到上一个可聚焦元素
 *
 * @param {HTMLElement} elem 起始元素
 */
export function focusBefore (elem) {
  return focusNav(elem, -1)
}

/**
 * 聚焦到下一个可聚焦元素
 *
 * @param {HTMLElement} elem 起始元素
 */
export function focusAfter (elem) {
  return focusNav(elem, 1)
}

/**
 * 安全地 focus 一个元素
 *
 * @param {HTMLElement} elem
 */
export function focus (elem) {
  if (!elem || typeof elem.focus !== 'function') {
    return
  }

  elem.focus()
}

let transformKey

function getTransformKey () {
  if (transformKey) {
    return transformKey
  }

  transformKey =
    '-ms-transform' in document.documentElement.style
      ? 'msTransform'
      : 'transform'
  return transformKey
}

/**
 * 获取变换矩阵
 *
 * @param {HTMLElement} el 目标元素
 * @return {string} matrix 信息
 */
export function getTransform (el) {
  return getComputedStyle(el)[getTransformKey()]
}

/**
 * 设置 transform
 *
 * @param {HTMLElement} el 目标元素
 * @param {string} value 变换值
 */
export function setTransform (el, value) {
  el.style[getTransformKey()] = value
}

/**
 * 切换指定元素的某个类名
 *
 * @param {HTMLElement} el 目标元素
 * @param {string} className 需要切换的类名
 * @param {boolean} force 强制添加/删除，为 true 则添加，为 false 则删除
 */
export function toggleClass (el, className, force) {
  if (el.classList) {
    return el.classList.toggle(className, force)
  }

  let klass = el.getAttribute('class')
  let klasses = uniq(klass.trim().split(/\s+/))
  let index = findIndex(klasses, k => k === className)
  if (index !== -1) {
    if (force === true) {
      return
    }
    klasses.splice(index, 1)
    el.setAttribute('class', klasses.join(' '))
    return
  }

  if (force === false) {
    return
  }
  el.setAttribute('class', klasses.concat([className]).join(' '))
}

/**
 * 元素是否包含指定 class
 *
 * @param {Element} el 目标元素
 * @param {string} className 需要检查的类名
 * @returns {boolean} 是否包含指定类名
 */
export function hasClass (el, className) {
  if (el.classList) {
    return el.classList.contains(className)
  }

  let klass = el.getAttribute('class')
  let klasses = klass.trim().split(/\s+/)
  return klasses.some(k => k === className)
}

const NORMAL_LINE_HEIGHT = 1.2

/**
 * 获取元素的行高 px 数
 *
 * @param {Element} el 目标元素
 * @returns {number} 行高 px 数
 */
export function getAbsoluteLineHeight (el) {
  let { lineHeight, fontSize } = getComputedStyle(el)
  let value = parseFloat(lineHeight)

  if (value) {
    return value
  }

  // line-height: normal
  let base = parseFloat(fontSize)
  return base * NORMAL_LINE_HEIGHT
}

export const MOUSE_EVENTS = [
  'auxclick',
  'click',
  'contextmenu',
  'dblclick',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseover',
  'mouseout',
  'mouseup',
  'select',
  'wheel'
]

export const KEYBOARD_EVENTS = ['keydown', 'keypress', 'keyup']
export const FOCUS_EVENTS = ['focus', 'blur', 'focusin', 'focusout']
export const VALUE_EVENTS = ['input', 'change']

const linear = (time, duration, distance) => (time / duration) * distance

export function scrollToCenter (
  viewport,
  scroller,
  target,
  duration,
  timingFn = linear
) {
  let { top: vTop, height: vHeight } = viewport.getBoundingClientRect()
  let { top: tTop, height: tHeight } = target.getBoundingClientRect()
  let { height: sHeight } = scroller.getBoundingClientRect()
  let initScrollTop = viewport.scrollTop
  let maxScrollTop = sHeight - vHeight
  let distance = tTop + tHeight / 2 - (vTop + vHeight / 2)
  if (initScrollTop + distance < 0) {
    distance = -initScrollTop
  }
  if (initScrollTop + distance > maxScrollTop) {
    distance = maxScrollTop - initScrollTop
  }
  let startTime = null
  const step = timestamp => {
    if (!startTime) {
      startTime = timestamp
    }
    let curTime = Math.min(timestamp - startTime, duration)
    let offset = !duration ? distance : timingFn(curTime, duration, distance)
    viewport.scrollTop = initScrollTop + offset
    if (offset !== distance) {
      requestAnimationFrame(step)
    }
  }
  requestAnimationFrame(step)
}

import { isFunction, uniqueId, remove, find, isNumber, isString, keys, noop, isEqual, pick } from 'lodash'
import { getNodes } from '../utils/context'
import { contains } from '../utils/dom'

let clickHandlerBindings = []
const clickBindingKey = '__veui_click_outside__'
document.addEventListener('click', e => {
  clickHandlerBindings.forEach(item => {
    item[clickBindingKey] && item[clickBindingKey].handler(e)
  })
}, true)

let hoverHandlerBindings = []
const hoverBindingKey = '__veui_hover_outside__'
document.addEventListener('mouseout', e => {
  hoverHandlerBindings.forEach(item => {
    item[hoverBindingKey] && item[hoverBindingKey].handler(e)
  })
})

function getElementsByRefs (refs, context) {
  const elements = []
  refs.forEach((ref) => {
    elements.push(...getNodes(ref, context))
  })
  return elements
}

function parseParams (el, arg, modifiers, value, context) {
  let refs
  let handler
  let trigger
  // delay 表示如果鼠标移动到 includeTargets 元素之外多少毫秒之后，才会触发 handler
  let delay
  let excludeSelf = false

  // 如果 value 是 Function 的话，其余参数就尽量从 modifier、arg 里面去解析
  // 否则从value里面去解析
  if (isFunction(value)) {
    handler = value

    refs = arg ? arg.split(',') : []

    trigger = modifiers.hover ? 'hover' : 'click'

    delay = find(keys(modifiers), key => isNumber(parseInt(key, 10)) && modifiers[key])
    delay = delay ? parseInt(delay, 10) : 0
  } else {
    let normalizedValue = value || {}
    handler = isFunction(normalizedValue.handler) ? normalizedValue.handler : noop

    refs = Array.isArray(normalizedValue.refs) ? normalizedValue.refs
      : (isString(normalizedValue.refs) ? normalizedValue.refs.split(',') : [normalizedValue.refs])

    trigger = normalizedValue.trigger === 'hover' ? 'hover' : 'click'

    delay = parseInt(normalizedValue.delay, 10)
    if (isNaN(delay)) {
      delay = 0
    }

    excludeSelf = !!normalizedValue.excludeSelf
  }

  return {
    refs,
    handler,
    trigger,
    delay,
    excludeSelf
  }
}

/**
 * 判断 element 在 DOM 树结构上是否被包含在 elements 里面
 *
 * @param {Element} element 待判断的元素
 * @param {Array.<Element>} elements 元素范围
 */
function isElementIn (element, elements) {
  return elements.some(elm => contains(elm, element))
}

function generate (el, { handler, trigger, delay, refs, excludeSelf }, context) {
  if (trigger === 'click') {
    return function (e) {
      // click 模式，直接判断元素包含情况
      let includeTargets = [...(excludeSelf ? [] : [el]), ...getElementsByRefs(refs, context)]
      if (e.type === trigger && !isElementIn(e.target, includeTargets)) {
        handler(e)
      }
    }
  }

  if (trigger === 'hover') {
    if (!delay) {
      // 如果没有设置 delay 参数，只要检查到鼠标移到 includeTargets 外面去了，就果断触发 outside handler 。
      return function handleOutsideWithoutDelay (e) {
        let includeTargets = [...(excludeSelf ? [] : [el]), ...getElementsByRefs(refs, context)]
        // 从 includeTargets 区域移到外面去了，果断触发 handler
        if (isElementIn(e.target, includeTargets) && !isElementIn(e.relatedTarget, includeTargets)) {
          handler(e)
        }
      }
    }

    let hoverDelayData = {
      state: 'ready' // 'ready' | 'out' | 'in'
    }
    // 如果设置了 delay ，在鼠标移出 includeTargets 之后设个计时器，并且标明已经移出去了（ `out` ）。
    // 如果鼠标在计时器计时结束之前，移回了 includeTargets ，就把标记改为 `in` 。
    // 如果鼠标在计时器计时结束时，还没有移回 includeTargets 内，对应的标记位还会是 `out` ，此时就可以触发 outside handler 了。
    return function handleOutsideWithDelay (e) {
      let includeTargets = [...(excludeSelf ? [] : [el]), ...getElementsByRefs(refs, context)]
      let isTargetIn = isElementIn(e.target, includeTargets)
      let isRelatedTargetIn = isElementIn(e.relatedTarget, includeTargets)
      if (isTargetIn && !isRelatedTargetIn) {
        hoverDelayData.state = 'out'

        el[hoverBindingKey].timer = setTimeout(() => {
          if (hoverDelayData.state === 'out') {
            handler(e)
          }
        }, delay)
      } else if (!isTargetIn && isRelatedTargetIn) {
        hoverDelayData.state = 'in'
      }
    }
  }
}

function clear (el) {
  if (el[clickBindingKey]) {
    remove(clickHandlerBindings, item => item[clickBindingKey].id === el[clickBindingKey].id)
    el[clickBindingKey] = null
  }

  if (el[hoverBindingKey]) {
    remove(hoverHandlerBindings, item => item[hoverBindingKey].id === el[hoverBindingKey].id)
    clearTimeout(el[hoverBindingKey].timer)
    el[hoverBindingKey] = null
  }
}

function refresh (el, { value, arg, modifiers, oldValue }, vnode) {
  const params = parseParams(el, arg, modifiers, value, vnode.context)

  // 真正发生了变化，才重刷
  let isClick = params.trigger === 'click'
  let fields = isClick
    ? ['refs', 'trigger', 'excludeSelf']
    : ['refs', 'trigger', 'delay', 'excludeSelf']
  let prevParams = pick(el[isClick ? clickBindingKey : hoverBindingKey], fields)
  if (isEqual(prevParams, pick(params, fields))) {
    return
  }

  clear(el)
  if (params.trigger === 'click') {
    el[clickBindingKey] = {
      id: uniqueId('veui-outside-'),
      handler: generate(el, params, vnode.context),
      trigger: 'click',
      refs: params.refs
    }
    clickHandlerBindings.push(el)
  } else if (params.trigger === 'hover') {
    el[hoverBindingKey] = {
      id: uniqueId('veui-outside-'),
      handler: generate(el, params, vnode.context),
      trigger: 'hover',
      delay: params.delay,
      refs: params.refs
    }
    hoverHandlerBindings.push(el)
  }
}

export default {
  bind: refresh,
  componentUpdated: refresh,
  unbind: clear
}

import {
  invert,
  isFunction,
  uniqueId,
  remove,
  find,
  isString,
  noop,
  isEqual,
  pick
} from 'lodash'
import { getNodes } from '../utils/context'
import { contains } from '../utils/dom'
import { getNumberArg } from '../utils/helper'

const TRIGGER_EVENT_MAP = {
  hover: 'mouseout',
  focus: 'focusin'
}

const EVENT_TRIGGER_MAP = invert(TRIGGER_EVENT_MAP)

const TRIGGER_TYPES = ['click', 'mousedown', 'mouseup', 'hover', 'focus']

let handlerBindings = {}

function getBindingKey (type) {
  return `__veui_${type}_outside__`
}

function addBinding (type, binding) {
  let bindings = handlerBindings[type]
  if (!bindings) {
    handlerBindings[type] = [binding]
    initBindingType(type)
  } else {
    bindings.push(binding)
  }
}

function initBindingType (type) {
  let key = getBindingKey(type)
  let event = TRIGGER_EVENT_MAP[type] || type

  document.addEventListener(
    event,
    e => {
      handlerBindings[type].forEach(item => {
        item[key] && item[key].handler(e)
      })
    },
    true
  )
}

function getElementsByRefs (refs, context) {
  const elements = []
  refs.forEach(ref => {
    elements.push(...getNodes(ref, context))
  })
  return elements
}

function parseParams (el, arg, modifiers, value, context) {
  let refs = arg ? arg.split(',') : []
  let handler
  let trigger = find(TRIGGER_TYPES, triggerType => triggerType in modifiers) || 'click'
  // delay 表示如果鼠标移动到 includeTargets 元素之外多少毫秒之后，才会触发 handler
  let delay = getNumberArg(modifiers, 0)
  let excludeSelf = !!modifiers.excludeSelf

  // 如果 value 是 Function 的话，其余参数就尽量从 modifier、arg 里面去解析
  // 否则从value里面去解析
  if (isFunction(value)) {
    handler = value
  } else {
    let normalizedValue = value || {}
    handler = isFunction(normalizedValue.handler)
      ? normalizedValue.handler
      : noop

    if (normalizedValue.refs) {
      refs = Array.isArray(normalizedValue.refs)
        ? normalizedValue.refs
        : isString(normalizedValue.refs)
          ? normalizedValue.refs.split(',')
          : [normalizedValue.refs]
    }

    trigger = normalizedValue.trigger || trigger || 'click'

    if ('delay' in normalizedValue) {
      let delayNum = Number(normalizedValue.delay) || 0
      delay = delayNum >= 0 ? delayNum : 0
    }

    if ('excludeSelf' in normalizedValue) {
      excludeSelf = !!normalizedValue.excludeSelf
    }
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
  if (trigger !== 'hover') {
    return function (e) {
      // 非移动触发的受控模式下，直接判断元素包含情况
      let includeTargets = [
        ...(excludeSelf ? [] : [el]),
        ...getElementsByRefs(refs, context)
      ]
      if ((EVENT_TRIGGER_MAP[e.type] || e.type) === trigger && !isElementIn(e.target, includeTargets)) {
        handler(e)
      }
    }
  } else {
    if (!delay) {
      // 如果没有设置 delay 参数，只要检查到鼠标移到 includeTargets 外面去了，就同步触发 outside handler 。
      return function handleOutsideSync (e) {
        let includeTargets = [
          ...(excludeSelf ? [] : [el]),
          ...getElementsByRefs(refs, context)
        ]
        // 从 includeTargets 区域移到外面去了，果断触发 handler
        if (
          isElementIn(e.target, includeTargets) &&
          !isElementIn(e.relatedTarget, includeTargets)
        ) {
          handler(e)
        }
      }
    }

    let hoverDelayData = {
      state: 'ready' // 'ready' | 'out' | 'in'
    }

    let bindingKey = getBindingKey('hover')
    // 如果设置了 delay ，在鼠标移出 includeTargets 之后设个计时器，并且标明已经移出去了（ `out` ）。
    // 如果鼠标在计时器计时结束之前，移回了 includeTargets ，就把标记改为 `in` 。
    // 如果鼠标在计时器计时结束时，还没有移回 includeTargets 内，对应的标记位还会是 `out` ，此时就可以触发 outside handler 了。
    return function handleOutsideAsync (e) {
      let includeTargets = [
        ...(excludeSelf ? [] : [el]),
        ...getElementsByRefs(refs, context)
      ]
      let isTargetIn = isElementIn(e.target, includeTargets)
      let isRelatedTargetIn = isElementIn(e.relatedTarget, includeTargets)
      if (isTargetIn && !isRelatedTargetIn) {
        hoverDelayData.state = 'out'

        clearTimeout(el[bindingKey].timer)
        el[bindingKey].timer = setTimeout(() => {
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
  TRIGGER_TYPES.forEach(type => {
    let key = getBindingKey(type)
    if (el[key]) {
      remove(handlerBindings[type], item => item[key].id === el[key].id)
      if (type === 'hover') {
        clearTimeout(el[key].timer)
      }
      el[key] = null
    }
  })
}

function refresh (el, { value, arg, modifiers, oldValue }, vnode) {
  const params = parseParams(el, arg, modifiers, value, vnode.context)
  let { trigger, refs, excludeSelf, delay } = params
  let key = getBindingKey(trigger)

  // 真正发生了变化，才重刷
  let fields = [
    'refs',
    'trigger',
    'excludeSelf',
    ...(trigger === 'hover' ? ['delay'] : [])
  ]

  let prevParams = pick(el[key], fields)

  if (isEqual(prevParams, pick(params, fields))) {
    return
  }

  clear(el)
  el[key] = {
    id: uniqueId('veui-outside-'),
    handler: generate(el, params, vnode.context),
    trigger,
    refs,
    excludeSelf,
    ...(trigger === 'hover' ? { delay } : {})
  }
  addBinding(trigger, el)
}

export default {
  bind: refresh,
  componentUpdated: refresh,
  unbind: clear
}

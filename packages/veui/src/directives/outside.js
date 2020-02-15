import { normalize } from 'vue-directive-normalizer'
import { invert, uniqueId, remove, isEqual, difference, omit } from 'lodash'
import { getNodes } from '../utils/context'
import { contains } from '../utils/dom'

const OPTIONS_SCHEMA = {
  value: 'handler',
  arg: 'refs[]',
  modifiers: {
    trigger: ['click', 'mousedown', 'mouseup', 'hover', 'focus'],
    excludeSelf: false,
    delay: 0
  }
}

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
        item[key] && item[key].realHandler(e)
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

/**
 * 判断 element 在 DOM 树结构上是否被包含在 elements 里面，包括被 Portal 移动过的
 *
 * @param {Element} element 待判断的元素
 * @param {Array.<Element>} elements 元素范围
 */
function isElementIn (element, elements) {
  let portal = getPortal(element)
  return elements.some(el => {
    return contains(el, element) || (portal ? contains(el, portal) : false)
  })
}

/**
 * 查找元素是否有绑定的 Portal 入口，如果有则返回该入口元素
 *
 * @param {Element} element 起始的元素
 * @returns {?Element} Portal 入口元素
 */
function getPortal (element) {
  let el = element
  while (el) {
    if (el.__portal__) {
      return el.__portal__
    }

    el = el.parentNode
  }

  return null
}

function generate (el, { handler, trigger, delay, refs, excludeSelf }, context) {
  if (trigger !== 'hover') {
    return function (e) {
      // 非移动触发的受控模式下，直接判断元素包含情况
      let includeTargets = [
        ...(excludeSelf ? [] : [el]),
        ...getElementsByRefs(refs, context)
      ]
      if (
        (EVENT_TRIGGER_MAP[e.type] || e.type) === trigger &&
        !isElementIn(e.target, includeTargets)
      ) {
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

    let bindingKey = getBindingKey('hover')
    return function handleOutsideAsync (e) {
      let includeTargets = [
        ...(excludeSelf ? [] : [el]),
        ...getElementsByRefs(refs, context)
      ]
      let isRelatedTargetIn = isElementIn(e.relatedTarget, includeTargets)
      if (isRelatedTargetIn) {
        clearTimeout(el[bindingKey].timer)
        el[bindingKey].timer = null
      } else {
        if (el[bindingKey].timer == null) {
          el[bindingKey].delayCb = () => {
            el[bindingKey].timer = null
            el[bindingKey].delayCb = null
            handler(e)
          }
          el[bindingKey].timer = setTimeout(el[bindingKey].delayCb, delay)
        }
      }
    }
  }
}

function clear (el) {
  TRIGGER_TYPES.forEach(type => {
    let key = getBindingKey(type)
    if (el[key]) {
      remove(handlerBindings[type], item => item[key].id === el[key].id)
      // bug: 导致 Dropdown 同时展开多个 popup
      // 这里直接 clear 可能会导致之前 delay 的 timer 无效，暂时降级下，忽略 delay 直接调用
      if (type === 'hover' && el[key].timer != null) {
        el[key].delayCb()
        clearTimeout(el[key].timer)
      }
      el[key] = null
    }
  })
}

const OMIT_OPTIONS = ['refs', 'id', 'realHandler', 'timer']

function isEqualOption (o1, o2) {
  return (
    difference(o1.refs, o2.refs).length === 0 &&
    isEqual(omit(o1, OMIT_OPTIONS), omit(o2, OMIT_OPTIONS))
  )
}

function refresh (el, binding, vnode) {
  let options = normalize(binding, OPTIONS_SCHEMA)
  let { trigger, refs, excludeSelf, delay } = options
  let key = getBindingKey(trigger)

  let oldOptions = el[key]

  if (oldOptions && isEqualOption(options, oldOptions)) {
    return
  }

  clear(el)
  el[key] = {
    id: uniqueId('veui-outside-'),
    handler: options.handler, // to compare with new one
    realHandler: generate(el, options, vnode.context),
    trigger,
    refs,
    excludeSelf,
    delay
  }
  addBinding(trigger, el)
}

export default {
  bind: refresh,
  componentUpdated: refresh,
  unbind: clear
}

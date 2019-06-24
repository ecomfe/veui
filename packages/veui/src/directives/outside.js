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
      let isRelatedTargetIn = isElementIn(e.relatedTarget, includeTargets)
      if (!isRelatedTargetIn) {
        hoverDelayData.state = 'out'

        clearTimeout(el[bindingKey].timer)
        el[bindingKey].timer = setTimeout(() => {
          if (hoverDelayData.state === 'out') {
            handler(e)
          }
        }, delay)
      } else if (isRelatedTargetIn) {
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

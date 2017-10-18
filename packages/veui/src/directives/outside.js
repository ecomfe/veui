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
  // delay 表示如果鼠标移动到 includeTargets 元素之外多少秒之后，才会触发 handler
  let delay

  // 如果 value 是 Function 的话，其余参数就尽量从 modifier、arg 里面去解析
  // 否则从value里面去解析
  if (isFunction(value)) {
    handler = value

    refs = arg ? arg.split(',') : []

    trigger = modifiers.hover ? 'hover' : 'click'

    delay = find(keys(modifiers), key => isNumber(parseInt(key, 10)) && modifiers[key])
    delay = delay ? parseInt(delay, 10) : 0
  } else {
    const normalizedValue = value || {}
    handler = isFunction(normalizedValue.handler) ? normalizedValue.handler : noop

    refs = Array.isArray(normalizedValue.refs) ? normalizedValue.refs
      : (isString(normalizedValue.refs) ? normalizedValue.refs.split(',') : [normalizedValue.refs])

    trigger = normalizedValue.trigger === 'hover' ? 'hover' : 'click'

    delay = parseInt(normalizedValue.delay, 10)
    if (isNaN(delay)) {
      delay = 0
    }
  }

  return {
    refs,
    handler,
    trigger,
    delay
  }
}

function generate (el, { handler, trigger, delay, refs }, context) {
  if (trigger === 'click') {
    return function (e) {
      // click 模式，直接判断元素包含情况
      let includeTargets = [el, ...getElementsByRefs(refs, context)]
      if (e.type === trigger && !includeTargets.some(element => contains(element, e.target))) {
        handler(e)
      }
    }
  }

  if (trigger === 'hover') {
    if (!delay) {
      return function (e) {
        let includeTargets = [el, ...getElementsByRefs(refs, context)]
        // 从 includeTargets 区域移到外面去了，果断触发 handler
        if (includeTargets.some(target => contains(target, e.target)) &&
          !includeTargets.some(target => contains(target, e.relatedTarget))
        ) {
          handler(e)
        }
      }
    } else {
      let hoverDelayData = {
        state: 'ready' // 'ready' | 'out' | 'in'
      }
      return function (e) {
        let includeTargets = [el, ...getElementsByRefs(refs, context)]
        let isTargetIn = includeTargets.some(target => contains(target, e.target))
        let isRelatedTargetIn = includeTargets.some(target => contains(target, e.relatedTarget))
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
  let fields = params.trigger === 'click'
    ? ['refs', 'trigger']
    : ['refs', 'trigger', 'delay']
  if (isEqual(pick(el[params.trigger === 'click' ? clickBindingKey : hoverBindingKey], fields), pick(params, fields))) {
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

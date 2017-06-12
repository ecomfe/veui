import { isFunction, uniqueId, remove, every, isArray, find, isNumber, isString } from 'lodash'
import { getNodes } from '../utils/context'

let handlerBindings = []
const bindingKey = '__veui_outside__'

document.addEventListener('click', e => {
  handlerBindings.forEach(item => {
    item[bindingKey] && item[bindingKey].handler(e)
  })
}, true)

function isContain (container, contained) {
  return container === contained || container.contains(contained)
}

function getElementsByRefs (refs, context) {
  const elements = []
  refs.forEach((ref) => {
    elements.push(...getNodes(ref, context))
  })
  return elements
}

function empty () {}

function parseParams (el, arg, modifiers, value, context) {
  let includeTargets
  let handler
  let trigger
  // delay 表示如果鼠标移动到 includeTargets 元素之外多少秒之后，才会触发 handler
  let delay

  // 如果 value 是 Function 的话，其余参数就尽量从 modifier、arg 里面去解析
  // 否则从value里面去解析
  if (isFunction(value)) {
    handler = value

    const refs = arg ? arg.split(',') : []
    includeTargets = [el, ...getElementsByRefs(refs, context)]

    trigger = modifiers.hover ? 'hover' : 'click'

    delay = find(Object.keys(modifiers), key => isNumber(parseInt(key, 10)) && modifiers[key])
    delay = delay ? parseInt(delay, 10) : 0
  } else {
    const normalizedValue = value || {}
    handler = isFunction(normalizedValue.handler) ? normalizedValue.handler : empty

    const refs = isArray(normalizedValue.refs) ? normalizedValue.refs
      : (isString(normalizedValue.refs) ? normalizedValue.refs.split(',') : [normalizedValue.refs])
    includeTargets = [el, ...getElementsByRefs(refs, context)]

    trigger = normalizedValue.trigger === 'hover' ? 'hover' : 'click'

    delay = parseInt(normalizedValue.delay, 10)
    if (isNaN(delay)) {
      delay = 0
    }
  }

  return {
    includeTargets,
    handler,
    trigger,
    delay
  }
}

function generate (el, { includeTargets, handler, trigger, delay }) {
  return function (e) {
    // click 模式，直接判断元素包含情况
    if (e.type === trigger && every(includeTargets, element => !isContain(element, e.target))) {
      handler(e)
    }
  }
}

function bindHover (el, { includeTargets, handler, delay }) {
  const bindingData = el[bindingKey] || {}
  bindingData.includeTargets = includeTargets
  bindingData.handler = handler
  bindingData.delay = delay

  // 已经绑定了，就不要重复绑定了
  if (bindingData.trigger === 'hover') {
    return
  }

  bindingData.trigger = 'hover'
  bindingData.hoverData = {
    state: 'ready',
    prevEvent: null,
    timer: null
  }
  bindingData.mouseenterHandler = (event) => {
    bindingData.hoverData.state = 'in'
    bindingData.hoverData.prevEvent = event
  }
  bindingData.mouseleaveHandler = (event) => {
    if (every(includeTargets, target => !isContain(target, event.target))) {
      return
    }

    bindingData.hoverData.state = 'out'
    bindingData.hoverData.prevEvent = event

    clearTimeout(bindingData.hoverData.timer)
    bindingData.hoverData.timer = setTimeout(() => {
      // 超时没移回，就要触发handler了
      if (bindingData.hoverData.state === 'out') {
        // 此处用最后一次记录的event对象
        handler(bindingData.hoverData.prevEvent)
        // 重置状态
        bindingData.hoverData.state = 'ready'
      }
    }, bindingData.delay)
  }

  // 所有目标元素都绑定一遍事件
  includeTargets.forEach((target) => {
    target.addEventListener('mouseenter', bindingData.mouseenterHandler)
    target.addEventListener('mouseleave', bindingData.mouseleaveHandler)
  })

  el[bindingKey] = bindingData
}

function unbindHover (el) {
  const bindingData = el[bindingKey]
  if (bindingData && bindingData.trigger === 'hover') {
    bindingData.includeTargets.forEach((target) => {
      target.removeEventListener('mouseenter', bindingData.mouseenterHandler)
      target.removeEventListener('mouseleave', bindingData.mouseleaveHandler)
    })
    el[bindingKey] = null
  }
}

function refresh (el, { value, arg, modifiers }, vnode) {
  const params = parseParams(el, arg, modifiers, value, vnode.context)

  if (params.trigger === 'click') {
    unbindHover(el)
    el[bindingKey] = {
      id: uniqueId('veui-outside-'),
      handler: generate(el, params),
      trigger: 'click'
    }
    handlerBindings.push(el)
  } else if (params.trigger === 'hover') {
    bindHover(el, params)
  }
}

export default {
  bind: refresh,
  update: refresh,
  unbind (el) {
    remove(handlerBindings, item => item[bindingKey].id === el[bindingKey].id)
    unbindHover(el)
  }
}

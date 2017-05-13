import { isFunction, uniqueId, remove, every, isArray, some, find, isNumber, isString } from 'lodash'
import { getNodes } from '../utils/context'

let handlerBindings = []
const bindingKey = '__veui_outside__'

document.addEventListener('click', e => {
  handlerBindings.forEach(item => {
    item[bindingKey] && item[bindingKey].handler(e)
  })
}, true)

document.addEventListener('mousemove', e => {
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

function generate (el, { includeTargets, handler, trigger, delay }) {
  const hoverState = {
    state: 'ready',
    prevEvent: null,
    timer: null
  }
  function hover (e, includeTargets, handler, trigger, delay) {
    if (delay === 0) {
      if (every(includeTargets, element => !isContain(element, e.target))) {
        handler(e)
      }
    } else {
      if (hoverState.state === 'ready' && some(includeTargets, element => isContain(element, e.target))) {
        // 如果鼠标第一次在includeTargets里面动，就改一下状态
        hoverState.state = 'in'
      } else if (hoverState.state === 'in' && every(includeTargets, element => !isContain(element, e.target))) {
        // 鼠标从includeTargets里面移出去了，就设置一下超时
        hoverState.state = 'out'

        hoverState.timer = setTimeout(() => {
          // 超时没移回，就要触发handler了
          if (hoverState.state === 'out' && every(includeTargets, element => !isContain(element, e.target))) {
            // 此处用最后一次记录的event对象
            handler(hoverState.prevEvent)
            // 重置状态
            hoverState.state = 'ready'
            hoverState.prevEvent = null
            hoverState.timer = null
          }
        }, delay)
      } else if (hoverState.state === 'out') {
        // 鼠标在外面了，就要随时检查鼠标是不是移回includeTargets了
        if (some(includeTargets, element => isContain(element, e.target))) {
          // 鼠标移了回来，重置一下状态
          hoverState.state = 'in'
          clearTimeout(hoverState.timer)
          hoverState.timer = null
        }
      }

      hoverState.prevEvent = e
    }
  }

  return function (e) {
    // click 模式，直接判断元素包含情况
    if (e.type === trigger && every(includeTargets, element => !isContain(element, e.target))) {
      handler(e)
    }

    if (e.type === 'mousemove' && trigger === 'hover') {
      hover(e, includeTargets, handler, trigger, delay)
    }
  }
}

function parseParams (el, arg, modifiers, value, context) {
  let includeTargets
  let handler
  let trigger
  // delay表示如果鼠标移动到includeTargets元素之外多少秒之后，才会触发handler；
  let delay

  // 如果value是Function的话，其余参数就尽量从modifier、arg里面去解析
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

export default {
  bind (el, { value, arg, modifiers }, vnode) {
    el[bindingKey] = {
      id: uniqueId('veui-outside-'),
      handler: generate(el, parseParams(el, arg, modifiers, value, vnode.context))
    }
    handlerBindings.push(el)
  },
  update (el, { value, arg, modifiers }, vnode) {
    el[bindingKey].handler = generate(el, parseParams(el, arg, modifiers, value, vnode.context))
  },
  unbind (el) {
    remove(handlerBindings, item => item[bindingKey].id === el[bindingKey].id)
  }
}

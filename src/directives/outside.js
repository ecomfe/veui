import { isFunction, uniqueId, remove, every, isArray, some, find, isNumber } from 'lodash'

let handlerBindings = []
const bindingKey = '__veui_click_outside__'

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
    if (context.$refs[ref]) {
      let element = context.$refs[ref]
      if (element.$el) {
        elements.push(element.$el)
      } else if (isArray(element)) {
        elements.splice(elements.length - 1, 0, ...element)
      } else if (element) {
        elements.push(element.$el)
      }
    }
  })
  return elements
}

function empty () {}

function generate (el, { whiteList, handler, trigger, delay }) {
  const hoverState = {
    state: 'ready',
    prevEvent: null,
    timer: null
  }
  function hover (e, whiteList, handler, trigger, delay) {
    if (delay === 0) {
      if (every(whiteList, element => !isContain(element, e.target))) {
        handler(e)
      }
    } else {
      if (hoverState.state === 'ready' && some(whiteList, element => isContain(element, e.target))) {
        // 如果鼠标第一次在whiteList里面动，就改一下状态
        hoverState.state = 'in'
      } else if (hoverState.state === 'in' && every(whiteList, element => !isContain(element, e.target))) {
        // 鼠标从whiteList里面移出去了，就设置一下超时
        hoverState.state = 'out'

        hoverState.timer = setTimeout(() => {
          // 超时没移回，就要触发handler了
          if (hoverState.state === 'out' && every(whiteList, element => !isContain(element, e.target))) {
            // 此处用最后一次记录的event对象
            handler(hoverState.prevEvent)
            // 重置状态
            hoverState.state = 'ready'
            hoverState.prevEvent = null
            hoverState.timer = null
          }
        }, delay)
      } else if (hoverState.state === 'out') {
        // 鼠标在外面了，就要随时检查鼠标是不是移回whiteList了
        if (some(whiteList, element => isContain(element, e.target))) {
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
    if (e.type === trigger && every(whiteList, element => !isContain(element, e.target))) {
      handler(e)
    }

    if (e.type === 'mousemove' && trigger === 'hover') {
      hover(e, whiteList, handler, trigger, delay)
    }
  }
}

function parseParams (el, arg, modifiers, value, context) {
  let whiteList
  let handler
  let trigger
  // delay表示如果鼠标移动到whiteList元素之外多少秒之后，才会触发handler；
  let delay

  const refs = arg ? arg.split(',') : []
  whiteList = [el, ...getElementsByRefs(refs, context)]

  handler = isFunction(value) ? value : empty

  trigger = modifiers.hover ? 'hover' : 'click'

  delay = find(Object.keys(modifiers), key => isNumber(parseInt(key, 10)) && modifiers[key])
  delay = delay ? parseInt(delay, 10) : 0

  return {
    whiteList,
    handler,
    trigger,
    delay
  }
}

export default {
  bind (el, { value, arg, modifiers }, vnode) {
    el[bindingKey] = {
      id: uniqueId(),
      handler: generate(el, parseParams(el, arg, modifiers, value, vnode.context))
    }
    handlerBindings.push(el)
  },
  update (el, { value, arg, modifiers }, vnode) {
    if (isFunction(value)) {
      el[bindingKey].handler = generate(el, parseParams(el, arg, modifiers, value, vnode.context))
    }
  },
  unbind (el) {
    remove(handlerBindings, item => item[bindingKey].id === el[bindingKey].id)
  }
}

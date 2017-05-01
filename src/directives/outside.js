import { isFunction, uniqueId, remove, isObject, every, isArray, some } from 'lodash'

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

function generate (el, value, context) {
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
    let whiteList = [el]
    let handler
    let trigger = 'click'
    // delay表示如果鼠标移动到whiteList元素之外多少秒之后，才会触发handler；
    let delay = 0

    if (isFunction(value)) {
      handler = value
    } else if (isObject(value)) {
      whiteList = isArray(value.refs) ? [el, ...getElementsByRefs(value.refs, context)] : whiteList
      handler = isFunction(value.handler) ? value.handler : empty
      trigger = value.trigger || trigger
      delay = value.delay || delay
    } else {
      throw new Error(`The value of v-outside directive must be a function or an object, but now it is ${value}`)
    }

    // click 模式，直接判断元素包含情况
    if (e.type === trigger && every(whiteList, element => !isContain(element, e.target))) {
      handler(e)
    }

    if (e.type === 'mousemove' && trigger === 'hover') {
      hover(e, whiteList, handler, trigger, delay)
    }
  }
}

export default {
  bind (el, { value }, vnode) {
    el[bindingKey] = {
      id: uniqueId(),
      handler: generate(el, value, vnode.context)
    }
    handlerBindings.push(el)
  },
  update (el, { value }, vnode) {
    if (isFunction(value)) {
      el[bindingKey].handler = generate(el, value, vnode.context)
    }
  },
  unbind (el) {
    remove(handlerBindings, item => item[bindingKey].id === el[bindingKey].id)
  }
}

import { isFunction, uniqueId, remove } from 'lodash'

let handlerBindings = []
const bindingKey = '__veui_click_outside__'

document.addEventListener('click', e => {
  handlerBindings.forEach(item => {
    item[bindingKey] && item[bindingKey].handler(e)
  })
}, true)

function generate (el, value) {
  return function (e) {
    if (!el.contains(e.target) && isFunction(value)) {
      // 目前只支持v-clickoutside="func"这种形式
      value(e)
    }
  }
}

export default {
  bind (el, {value}) {
    el[bindingKey] = {
      id: uniqueId(),
      handler: generate(el, value)
    }
    handlerBindings.push(el)
  },
  update (el, {value}) {
    if (isFunction(value)) {
      el[bindingKey].handler = generate(el, value)
    }
  },
  unbind (el) {
    remove(handlerBindings, item => item[bindingKey].id === el[bindingKey].id)
  }
}

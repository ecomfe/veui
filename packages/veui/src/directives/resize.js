import { addListener, removeListener } from 'resize-detector'
import { debounce, throttle, isObject, assign } from 'lodash'

const modeMap = {
  debounce,
  throttle
}

function attach (el, { value, oldValue, arg = 150, modifiers }) {
  let options = {
    delay: arg,
    mode: Object.keys(modifiers)[0],
    handler: value
  }
  if (isObject(value)) {
    assign(options, value)
  }

  let fn = modeMap[options.mode]
  let cb = fn ? fn(options.handler, options.delay) : options.handler

  if (!oldValue) {
    el.__veui_resize_handler__ = cb
    addListener(el, cb)
  } else {
    let oldOptions = {
      delay: 150,
      mode: null,
      handler: oldValue
    }

    if (isObject(oldValue)) {
      assign(oldOptions, oldValue)
    }

    let changed = oldValue.delay !== options.delay ||
      oldValue.mode !== options.mode ||
      oldValue.handler !== options.handler

    if (changed) {
      let oldCb = el.__veui_resize_handler__
      removeListener(el, oldCb)
      el.__veui_resize_handler__ = cb
      addListener(el, cb)
    }
  }
}

function clear (el) {
  removeListener(el, el.__veui_resize_handler__)
}

export default {
  inserted: attach,
  componentUpdated: attach,
  unbind: clear
}

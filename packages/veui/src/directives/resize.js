import { addListener, removeListener } from 'resize-detector'
import { debounce, throttle, isObject, assign, isEqual, find } from 'lodash'

const modeMap = {
  debounce,
  throttle
}

function attach (el, { value, oldValue, arg = 150, modifiers }) {
  let mode = find(Object.keys(modeMap), mode => modifiers[mode])
  let options = {
    delay: arg,
    mode,
    handler: value,
    leading: modifiers.leading
  }
  if (isObject(value)) {
    assign(options, value)
  }

  let fn = modeMap[options.mode]
  let cb = fn ? fn(options.handler, options.delay, options.leading) : options.handler

  if (!oldValue) {
    el.__veui_resize_handler__ = cb
    addListener(el, cb)
  } else {
    let oldOptions = {
      delay: arg,
      mode,
      handler: oldValue,
      leading: modifiers.leading
    }

    if (isObject(oldValue)) {
      assign(oldOptions, oldValue)
    }

    let changed = isEqual(oldValue, options)

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

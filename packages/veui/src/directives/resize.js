import { addListener, removeListener } from 'resize-detector'
import { debounce, throttle, isObject, assign, isEqual, find } from 'lodash'
import { parseTimingArg } from '../utils/helper'

const modeMap = {
  debounce,
  throttle
}

function attach (el, { value, oldValue, modifiers }) {
  let mode = find(Object.keys(modeMap), mode => modifiers[mode])
  let wait = parseTimingArg(modifiers, 150)
  let options = {
    wait,
    mode,
    handler: value,
    leading: modifiers.leading
  }
  if (isObject(value)) {
    assign(options, value)
  }

  let fn = modeMap[options.mode]
  let cb = fn ? fn(options.handler, options.wait, options.leading) : options.handler

  if (!oldValue) {
    el.__veui_resize_handler__ = cb
    addListener(el, cb)
  } else {
    let oldOptions = {
      wait,
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

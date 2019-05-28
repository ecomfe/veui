import { addListener, removeListener } from 'resize-detector'
import { normalize } from 'vue-directive-normalizer'
import { debounce, throttle, isEqual } from 'lodash'

const OPTIONS_SCHEMA = {
  value: 'handler',
  modifiers: {
    mode: [null, 'throttle', 'debounce'],
    wait: 150,
    leading: false
  }
}

const modeMap = {
  debounce,
  throttle
}

function attach (el, binding) {
  const options = normalize(binding, OPTIONS_SCHEMA)

  let fn = modeMap[options.mode]
  let cb = fn
    ? fn(options.handler, options.wait, {
      leading: !!options.leading
    })
    : options.handler

  if (el.__resizeData__ && !isEqual(el.__resizeData__.options, options)) {
    removeListener(el, el.__resizeData__.handler)
    el.__resizeData__.options = options
    el.__resizeData__.handler = cb
    addListener(el, cb)
    return
  }

  if (!el.__resizeData__) {
    el.__resizeData__ = {
      options,
      handler: cb
    }
    addListener(el, cb)
  }
}

function clear (el) {
  removeListener(el, el.__resizeData__.handler)
  el.__resizeData__ = null
}

export default {
  inserted: attach,
  componentUpdated: attach,
  unbind: clear
}

import { addListener, removeListener } from 'resize-detector'
import { debounce } from 'lodash'

function attach (el, { value, oldValue }) {
  if (!oldValue) {
    let fn = debounce(value, 150)
    el.__veui_resize_handler__ = fn
    addListener(el, fn)
    return
  }

  if (oldValue && value.toString() !== oldValue.toString()) {
    let fn = el.__veui_resize_handler__
    removeListener(el, fn)
    fn = debounce(value, 150)
    el.__veui_resize_handler__ = fn
    addListener(el, fn)
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

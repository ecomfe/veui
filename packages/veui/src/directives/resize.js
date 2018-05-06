import {addListener, removeListener} from 'resize-detector'
import {debounce, uniqueId} from 'lodash'
import config from '../managers/config'

function attach (el, { value, oldValue }) {
  if (!oldValue) {
    let fn = debounce(value, 150)
    let id = uniqueId('veui-resize-')
    el.dataset.veuiResizeId = id
    config.set(id, fn)
    addListener(el, fn)
    return
  }

  if (oldValue && value.toString() !== oldValue.toString()) {
    let id = el.dataset.veuiResizeId
    removeListener(el, config.get(id))
    let fn = debounce(value, 150)
    config.set(id, fn)
    addListener(el, fn)
  }
}

function clear (el) {
  removeListener(el, config.get(el.dataset.veuiResizeId))
}

export default {
  inserted: attach,
  componentUpdated: attach,
  unbind: clear
}

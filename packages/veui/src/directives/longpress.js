import { normalize } from 'vue-directive-normalizer'
import config from '../managers/config'

config.defaults({
  'longpress.timeout': 500,
  'longpress.repeatInterval': 100
})

const OPTIONS_SCHEMA = {
  value: 'handler',
  modifiers: {
    repeat: false
  },
  defaults: () => ({
    timeout: config.get('longpress.timeout'),
    repeatInterval: config.get('longpress.repeatInterval')
  })
}

function clear (el) {
  let longpressData = el.__longpressData__
  el.removeEventListener('mousedown', longpressData.mousedownHandler)
  window.removeEventListener('mouseup', longpressData.mouseupHandler)
  el.__longpressData__ = null
}

function refresh (el, binding) {
  const options = normalize(binding, OPTIONS_SCHEMA)

  if (el.__longpressData__) {
    el.__longpressData__.setOptions(options)
    return
  }

  let longpressData = createLongpressData()

  el.addEventListener('mousedown', longpressData.mousedownHandler)
  el.__longpressData__ = longpressData
  el.__longpressData__.setOptions(options)
}

function createLongpressData () {
  let longpressData = {
    options: {},

    setOptions (options) {
      longpressData.options = options
    },

    timer: null,

    mousedownHandler (e) {
      let { handler, timeout, repeat, repeatInterval } = longpressData.options

      longpressData.timer = setTimeout(() => {
        handler()

        if (repeat && repeatInterval) {
          longpressData.timer = setInterval(() => {
            handler()
          }, repeatInterval)
        }
      }, timeout)

      e.preventDefault()

      window.addEventListener('mouseup', longpressData.mouseupHandler)
    },

    mouseupHandler (e) {
      let { timer } = longpressData
      clearTimeout(timer)
      clearInterval(timer)

      e.preventDefault()

      window.removeEventListener('mouseup', longpressData.mouseupHandler)
    }
  }

  return longpressData
}

export default {
  bind: refresh,
  componentUpdated: refresh,
  unbind: clear
}

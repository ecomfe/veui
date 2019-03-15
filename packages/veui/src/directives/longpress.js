import { get, noop, isFunction } from 'lodash'
import config from '../managers/config'

config.defaults({
  'longpress.timeout': 500,
  'longpress.repeatInterval': 100
})

function clear (el) {
  let longpressData = el.__longpressData__
  if (!longpressData) {
    return
  }

  el.removeEventListener('mousedown', longpressData.mousedownHandler)
  window.removeEventListener('mouseup', longpressData.mouseupHandler)
  el.__longpressData__ = null
}

function parseParams ({ value, modifiers }) {
  let { repeat } = modifiers
  if (!repeat) {
    repeat = get(value, 'repeat', true)
  }

  function parseFn (name) {
    if (isFunction(value)) {
      return value
    }
    let fn = get(value, name, noop)
    return isFunction(fn) ? fn : noop
  }

  // 解析回调函数
  let handler = parseFn('handler')

  let timeout = get(value, 'timeout', config.get('longpress.timeout'))
  let repeatInterval = get(
    value,
    'repeatInterval',
    config.get('longpress.repeatInterval')
  )

  return {
    handler,
    timeout,
    repeat,
    repeatInterval
  }
}

function refresh (el, { modifiers, value, arg }) {
  const params = parseParams({ arg, value, modifiers })

  if (el.__longpressData__) {
    el.__longpressData__.setOptions(params)
    return
  }

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
    },

    mouseupHandler (e) {
      let { timer } = longpressData
      if (timer) {
        clearTimeout(timer)
        clearInterval(timer)
      }
      e.preventDefault()
    }
  }

  el.addEventListener('mousedown', longpressData.mousedownHandler)
  window.addEventListener('mouseup', longpressData.mouseupHandler)
  el.__longpressData__ = longpressData
  el.__longpressData__.setOptions(params)
}

export default {
  bind: refresh,
  componentUpdated: refresh,
  unbind: clear
}

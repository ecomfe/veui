import { normalize } from 'vue-directive-normalizer'
import config from '../managers/config'

config.defaults({
  'nudge.step': 1
})

const OPTIONS_SCHEMA = {
  value: 'update',
  modifiers: {
    axis: ['y', 'x']
  },
  defaults: () => ({
    step: config.get('nudge.step')
  })
}

function clear (el) {
  let nudgeData = el.__nudgeData__
  if (!nudgeData) {
    return
  }

  el.removeEventListener('keydown', nudgeData.keydownHandler)
  el.__nudgeData__ = null
}

function refresh (el, binding) {
  const options = normalize(binding, OPTIONS_SCHEMA)

  if (el.__nudgeData__) {
    el.__nudgeData__.setOptions(options)
    return
  }

  let nudgeData = {
    options: {},

    setOptions (options) {
      nudgeData.options = options
    },

    keydownHandler (event) {
      let { key, altKey, shiftKey } = event
      let { step, axis, update } = nudgeData.options

      let increase = step
      if (altKey) {
        increase *= 0.1
      } else if (shiftKey) {
        increase *= 10
      }

      switch (true) {
        case axis === 'x' && (key === 'ArrowRight' || key === 'Right'):
        case axis === 'y' && (key === 'ArrowUp' || key === 'Up'):
          increase *= 1
          break

        case axis === 'x' && (key === 'ArrowLeft' || key === 'Left'):
        case axis === 'y' && (key === 'ArrowDown' || key === 'Down'):
          increase *= -1
          break

        default:
          increase = 0
          break
      }

      if (increase === 0) {
        return
      }

      event.preventDefault()
      update(increase)
    }
  }

  el.addEventListener('keydown', nudgeData.keydownHandler)
  el.__nudgeData__ = nudgeData
  el.__nudgeData__.setOptions(options)
}

export default {
  bind: refresh,
  componentUpdated: refresh,
  unbind: clear
}

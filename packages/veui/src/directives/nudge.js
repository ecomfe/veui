import { normalize } from 'vue-directive-normalizer'
import config from '../managers/config'

config.defaults(
  {
    step: 1
  },
  'nudge'
)

const OPTIONS_SCHEMA = {
  value: 'update',
  modifiers: {
    axis: [null, 'x', 'y']
  },
  defaults: () => ({
    step: config.get('nudge.step')
  })
}

function clear (el) {
  let nudgeData = el.__nudgeData__

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

      if (
        ((key === 'ArrowRight' || key === 'Right') && axis !== 'y') ||
        ((key === 'ArrowUp' || key === 'Up') && axis !== 'x')
      ) {
        increase *= 1
      } else if (
        ((key === 'ArrowLeft' || key === 'Left') && axis !== 'y') ||
        ((key === 'ArrowDown' || key === 'Down') && axis !== 'x')
      ) {
        increase *= -1
      } else {
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

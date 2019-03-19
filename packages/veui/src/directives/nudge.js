import { find, get, noop, isFunction } from 'lodash'
import config from '../managers/config'
import { getNumberArg } from '../utils/helper'

config.defaults({
  'nudge.step': 1
})

function clear (el) {
  let nudgeData = el.__nudgeData__
  if (!nudgeData) {
    return
  }

  el.removeEventListener('keydown', nudgeData.keydownHandler)
  el.__nudgeData__ = null
}

function parseParams ({ value, modifiers }) {
  // 解析 axis
  let axis = find(['x', 'y'], item => modifiers[item])
  if (!axis) {
    axis = get(value, 'axis', 'y')
  }

  function parseFn (name) {
    if (isFunction(value)) {
      return value
    }

    let fn = get(value, name, noop)
    return isFunction(fn) ? fn : noop
  }

  // 解析回调函数
  let update = parseFn('update')

  let step =
    get(value, 'step') || getNumberArg(modifiers, config.get('nudge.step'))

  return {
    axis,
    step,
    update
  }
}

function refresh (el, { modifiers, value, arg }) {
  const params = parseParams({ arg, value, modifiers })

  if (el.__nudgeData__) {
    el.__nudgeData__.setOptions(params)
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
  el.__nudgeData__.setOptions(params)
}

export default {
  bind: refresh,
  componentUpdated: refresh,
  unbind: clear
}

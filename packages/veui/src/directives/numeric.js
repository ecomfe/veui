import { find, get, noop, isFunction } from 'lodash'
import config from '../managers/config'

config.defaults({
  'numeric.step': 1
})

function clear (el) {
  let numericData = el.numericData
  if (!numericData) {
    return
  }

  el.removeEventListener('keydown', numericData.keydownHandler)
  el.numericData = null
}

function parseParams (el, { arg, value, modifiers }, vnode) {
  // 解析 axis
  let axis = find(['x', 'y'], item => modifiers[item])
  if (!axis) {
    axis = get(value, 'axis', 'y')
  }

  function parseFn (name) {
    let fn = get(value, name, noop)
    return isFunction(fn) ? fn : noop
  }

  // 解析回调函数
  let update = parseFn('update')

  let step = get(value, 'step', config.get('numeric.step'))

  return {
    axis,
    step,
    update
  }
}

function refresh (el, { modifiers, value, oldValue, arg }, vnode) {
  const params = parseParams(el, { arg, value, modifiers }, vnode)

  if (el.numericData) {
    el.numericData.setOptions(params)
    return
  }

  let numericData = {
    options: {},

    setOptions (options) {
      numericData.options = options
    },

    keydownHandler (event) {
      let {key, altKey, shiftKey} = event
      let options = numericData.options

      let increase = options.step
      if (altKey) {
        increase *= 0.1
      } else if (shiftKey) {
        increase *= 10
      }

      switch (true) {
        case options.axis === 'x' && key === 'ArrowRight':
        case options.axis === 'y' && key === 'ArrowUp':
          event.preventDefault()
          increase *= 1
          break

        case options.axis === 'x' && key === 'ArrowLeft':
        case options.axis === 'y' && key === 'ArrowDown':
          event.preventDefault()
          increase *= -1
          break

        default:
          increase = 0
          break
      }

      if (increase === 0) {
        return
      }

      options.update(increase)
    }
  }

  el.addEventListener('keydown', numericData.keydownHandler)
  el.numericData = numericData
}

export default {
  bind: refresh,
  componentUpdated: refresh,
  unbind: clear
}

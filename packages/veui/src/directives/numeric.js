import { find, get, keys, includes } from 'lodash'
import config from '../managers/config'
import { getTypedAncestor } from '../utils/helper'
import { getUITypes } from '../utils/context'

const numericDefaults = {
  'numeric.step': 1,
  'numeric.bigStep': 10,
  'numeric.smallStep': 0.1,
  'numeric.precision': 2
}

config.defaults(numericDefaults)

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

  // 解析其他配置
  return keys(numericDefaults).reduce(function (ret, key) {
    let k = key.substring(key.indexOf('.') + 1)
    ret[k] = get(value, k, numericDefaults[key])
    return ret
  }, {
    axis
  })
}

/**
 * 从 vnode 获得 input component
 * v-numeric 用于 Input Component 及其子节点, Input Element
 *
 * @param {Vnode} vnode
 */
function getInput (vnode) {
  if (vnode.componentOptions) {
    // component
    if (includes(getUITypes(vnode), 'input')) {
      return vnode.componentInstance
    }
    return getTypedAncestor(vnode.componentInstance, 'input')
  }

  let elm = vnode.elm
  if (elm && elm.tagName.toLowerCase() === 'input') {
    return elm
  } else if (vnode.context) {
    return getInput(vnode.context.$vnode)
  }
  return null
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
        increase = options.smallStep
      } else if (shiftKey) {
        increase = options.bigStep
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

      let input = getInput(vnode) || {}
      let val = input.value
      if (val === undefined) {
        return
      }

      let digits
      let unit
      if (typeof val === 'string') {
        let matched = val.match(/^(\d+(?:\.\d+)?)(.*)$/)
        if (!matched) {
          return
        }
        [digits, unit] = matched.slice(1)
        digits = parseFloat(digits)
        if (isNaN(digits)) {
          return
        }
      } else if (typeof val === 'number') {
        digits = val
      } else {
        return
      }

      // 因为加 0.1 所以处理一下，否则会出现 0.30000000000000004
      let precision = Math.pow(10, options.precision)
      let newVal = Math.round((digits + increase) * precision) / precision
      if (unit !== undefined) {
        newVal += unit
      }
      if (input.localValue !== undefined) {
        // TODO: Input Component localValue 非 textarea 不触发 input
        input.localValue = newVal
      } else {
        input.value = newVal
      }
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

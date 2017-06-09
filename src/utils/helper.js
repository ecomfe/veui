import { includes, camelCase } from 'lodash'
import { getByName } from './object'

export function getTypedAncestorTracker (name, type) {
  return {
    computed: {
      [camelCase(name)] () {
        let current = this.$parent
        while (current) {
          let { uiTypes } = current.$options
          if (uiTypes && includes(uiTypes, type || name)) {
            return current
          }
          current = current.$parent
        }
        return null
      }
    }
  }
}

export function isTopestType (vm, type) {
  let parent = vm.$parent
  while (parent && !includes(getByName('$options.uiTypes', parent), type)) {
    parent = parent.$parent
  }
  return !parent
}

export function getModelProp (vm) {
  return getByName('$options.model.prop', vm) || 'value'
}

export function getModelEvent (vm) {
  return getByName('$options.model.event', vm) || 'input'
}

export function isFalsy (val) {
  return val == null || val === '' || val === false
}

// export function splitToArray (val, separator = ',') {
//   return Array.isArray(val) ? val : val.split(separator).map(item => item && item.trim())
// }

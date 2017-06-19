import { includes, camelCase, get } from 'lodash'

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
  while (parent && !includes(get(parent, '$options.uiTypes'), type)) {
    parent = parent.$parent
  }
  return !parent
}

export function getModelProp (vm) {
  return get(vm, '$options.model.prop', 'value')
}

export function getModelEvent (vm) {
  return get(vm, '$options.model.event', 'input')
}

export function isFalsy (val) {
  return val == null || val === '' || val === false
}

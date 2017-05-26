import { includes } from 'lodash'

export function genParentTracker (name, type) {
  return {
    computed: {
      [name] () {
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

export function promiseAllSettled (promises) {
  return Promise.all(
    promises.map(p => Promise.resolve(p).then(
      val => ({ val }),
      err => ({ err })
    ))
  )
}

export function getTypeByInstance (obj) {
  if (obj !== null && obj !== undefined) {
    return getType(obj.constructor)
  } else {
    return obj
  }
}

export function getType (fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}

export function isType (type, fn) {
  return getType(fn) === getType(type)
}

export function getCustomModelProp (vm) {
  return (vm && vm.$options && vm.$options.model && vm.$options.model.prop) || 'value'
}

export function getCustomModelEvent (vm) {
  return (vm && vm.$options && vm.$options.model && vm.$options.model.event) || 'input'
}

export function isFalsely (val) {
  return val == null || val === ''
}

export function splitToArray (val, separator = ',') {
  return Array.isArray(val) ? val : val.split(separator)
}

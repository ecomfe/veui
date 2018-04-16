import { union } from 'lodash'

export function getTypeByInstance (obj) {
  if (obj !== null && obj !== undefined) {
    return getType(obj.constructor)
  } else {
    return obj
  }
}

export function getType (type) {
  const match = type && type.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}

export function isType (type, obj) {
  return getType(type) === getTypeByInstance(obj)
}

export function isArrayContentEqual (arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false
  }

  return union(arr1, arr2).length === arr1.length
}

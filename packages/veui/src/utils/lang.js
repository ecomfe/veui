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

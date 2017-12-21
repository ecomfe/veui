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

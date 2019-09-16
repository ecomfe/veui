import { find as _find } from 'lodash'

export function walk (array, callback, alias = 'children') {
  if (!array || typeof callback !== 'function') {
    return
  }

  if (!Array.isArray(array)) {
    array = getChildrenByAlias(array, alias)
    if (!array) {
      return
    }
  }

  array.forEach(item => {
    callback(item)

    let children = getChildrenByAlias(item, alias)
    if (children) {
      walk(children, callback, alias)
    }
  })
}

export function find (array, predicate, alias = 'children') {
  if (!array || typeof predicate !== 'function') {
    return null
  }

  let result = null
  array.some(item => {
    let children = getChildrenByAlias(item, alias)
    if (!children) {
      if (predicate(item)) {
        result = item
        return true
      }
    }
    let inner = find(children, predicate, alias)
    if (inner !== null) {
      result = inner
      return true
    }
  })
  return result
}

function getChildrenByAlias (obj, alias) {
  let keys = typeof alias === 'string' ? [alias] : alias

  let key = _find(keys, key => {
    return Array.isArray(obj[key])
  })

  return key ? obj[key] : null
}

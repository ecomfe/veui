import { find as _find } from 'lodash'

export function walk (array, callback, alias = 'children') {
  _walk(array, callback, { depth: 0 }, alias)
}

function _walk (array, callback, context, alias = 'children') {
  if (!array || !callback) {
    return
  }

  let enter
  let exit
  if (typeof callback === 'function') {
    enter = callback
  } else {
    enter = callback.enter
    exit = callback.exit
  }

  if (!enter && !exit) {
    return
  }

  if (!Array.isArray(array)) {
    array = getChildrenByAlias(array, alias)
    if (!array) {
      return
    }
  }

  let { depth } = context
  array.forEach((item, index) => {
    let ctx = { ...context, index, depth }

    if (typeof enter === 'function') {
      enter(item, ctx)
    }

    let children = getChildrenByAlias(item, alias)
    if (children) {
      _walk(children, callback, { ...ctx, depth: depth + 1 }, alias)
    }

    if (typeof exit === 'function') {
      exit(item, ctx)
    }
  })
}

export function find (array, predicate, alias = 'children') {
  if (!array || typeof predicate !== 'function') {
    return null
  }

  let result = null
  array.some(item => {
    if (predicate(item)) {
      result = item
      return true
    }
    let children = getChildrenByAlias(item, alias)
    if (!children) {
      return false
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

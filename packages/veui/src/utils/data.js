import { find } from 'lodash'

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

function getChildrenByAlias (obj, alias) {
  let keys = typeof alias === 'string' ? [alias] : alias

  let key = find(keys, key => {
    return Array.isArray(obj[key])
  })

  return key ? obj[key] : null
}

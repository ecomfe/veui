import { getTypedAncestorTracker } from '../utils/helper'
import { isObject } from 'lodash'

function getDataGetter (key) {
  return function () {
    return this.table[key]
  }
}

function getOneKeyValue (map) {
  for (let key in map) {
    return {
      key,
      value: map[key]
    }
  }
  return null
}

export default {
  computed: getTypedAncestorTracker('table').computed
}

export function mapTableData (...keys) {
  return keys.reduce((acc, key) => {
    if (isObject(key)) {
      let kv = getOneKeyValue(key)
      if (!kv) {
        return acc
      }
      acc[kv.value] = getDataGetter(kv.key)
    } else {
      acc[key] = getDataGetter(key)
    }
    return acc
  }, {})
}

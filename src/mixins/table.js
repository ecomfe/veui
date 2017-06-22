import { includes, isObject } from 'lodash'

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
  computed: {
    table () {
      let current = this.$parent
      while (current) {
        let { uiTypes } = current.$options
        if (uiTypes && includes(uiTypes, 'table')) {
          return current
        }
        current = current.$parent
      }
      return null
    }
  },
  mapTableData (...keys) {
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
}

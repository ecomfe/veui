import { isObject } from 'lodash'
import type from './type'

function set (obj, key, value, ns, override, merge) {
  if (isObject(key)) {
    ns = value
    value = key
    Object.keys(value).forEach(k => {
      set(obj, k, value[k], ns, override, merge)
    })
    return
  }

  if (typeof key !== 'string') {
    throw new Error('`Config key must be a string value.')
  }

  let k = ns ? `${ns}.${key}` : key
  if (!(k in obj) || override || merge) {
    if (!merge) {
      if (!(k in obj) || override) {
        obj[k] = value
      }
      return
    }

    if (!isObject(obj[k]) || !isObject(value)) {
      throw new Error('`config.merge` only handles objects.')
    }

    Object.keys(value).forEach(key => {
      if (!(key in obj[k]) || override) {
        obj[k][key] = value[key]
      }
    })
  }
}

export class ConfigManager {
  constructor () {
    this.store = {}
  }

  set (key, value, ns) {
    set(this.store, key, value, ns, true, false)
  }

  defaults (key, value, ns) {
    set(this.store, key, value, ns, false, false)
  }

  merge (key, value, ns) {
    set(this.store, key, value, ns, true, true)
  }

  mergeDefaults (key, value, ns) {
    set(this.store, key, value, ns, false, true)
  }

  get (key) {
    return type.clone(this.store[key])
  }
}

const instance = new ConfigManager()
export default instance

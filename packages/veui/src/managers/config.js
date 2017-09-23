import { keys } from 'lodash'
import type from './type'

function set (obj, key, value, ns, override) {
  if (typeof key === 'object') {
    override = ns
    ns = value
    value = key
    keys(value).forEach(key => {
      set(obj, key, value[key], ns, override)
    })
    return
  }

  if (typeof key !== 'string') {
    return
  }

  if (!(key in obj) || override) {
    let k = ns ? `${ns}.${key}` : key
    obj[k] = value
  }
}

export class ConfigManager {
  constructor () {
    this.store = {}
  }

  set (obj, key, value, ns) {
    set(this.store, obj, key, value, ns, true)
  }

  defaults (obj, key, value, ns) {
    set(this.store, obj, key, value, ns, false)
  }

  get (key) {
    return type.clone(this.store[key])
  }
}

const instance = new ConfigManager()
export default instance

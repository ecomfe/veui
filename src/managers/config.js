import { cloneDeep } from 'lodash'

function set (obj, key, value, isOverride) {
  if (typeof key === 'object') {
    isOverride = value
    value = key
    Object.keys(value).forEach(key => {
      set(obj, key, value, isOverride)
    })
    return
  }

  if (typeof key !== 'string') {
    return
  }

  if (!(key in obj) || isOverride) {
    obj[key] = value
  }
}

export class ConfigManager {
  constructor () {
    this.store = {}
  }

  set (key, value) {
    set(this, key, value, true)
  }

  defaults (key, value) {
    set(this, key, value, false)
  }

  get (key) {
    return cloneDeep(this.store[key])
  }
}

const instance = new ConfigManager()
export default instance

import clone from './clone'

function set (obj, key, value, isOverride) {
  if (typeof key === 'object') {
    isOverride = value
    value = key
    Object.keys(value).forEach(key => {
      set(obj, key, value[key], isOverride)
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

  set (...args) {
    set(this.store, ...args, true)
  }

  defaults (...args) {
    set(this.store, ...args, false)
  }

  get (key) {
    return clone.exec(this.store[key])
  }
}

const instance = new ConfigManager()
export default instance

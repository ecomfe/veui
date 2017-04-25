export class ConfigManager {
  constructor () {
    this.store = {}
  }

  set (key, value) {
    this.store[key] = value
  }

  setDefault (key, value) {
    if (key in this.store) {
      return
    }
    return this.set(key, value)
  }

  get (key) {
    return this.store[key]
  }
}

const instance = new ConfigManager()
export default instance

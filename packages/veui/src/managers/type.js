import { cloneDeepWith, find } from 'lodash'
import { isType } from '../utils/lang'

export class Type {
  constructor () {
    this.configs = [
      {
        type: Function,
        clone (val) {
          return val
        }
      }
    ]
  }

  clone (val) {
    return cloneDeepWith(val, cloneBuiltIn.bind(this))
  }

  register (newConfig) {
    if (!newConfig) {
      return
    }

    let config = find(this.configs, config => config.type === newConfig.type)
    if (!config) {
      this.configs.push(newConfig)
    } else {
      config.clone = newConfig.clone
    }
  }
}

function cloneBuiltIn (val) {
  let config = find(this.configs, config => isType(config.type, val))
  if (config) {
    return config.clone(val)
  }
}

const instance = new Type()
export default instance

import { cloneDeepWith, find } from 'lodash'
import { isType, getTypeByInstance } from '../utils/lang'

export class Type {
  constructor () {
    this.configs = [
      {
        type: Date,
        clone (val) {
          return new Date(val.getTime())
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

    let config = find(this.configs, config => isType(config.type, newConfig.type))
    if (config) {
      this.configs.push(newConfig)
    } else {
      config.clone = newConfig.clone
    }
  }
}

function cloneBuiltIn (val) {
  let config = find(this.configs, config => isType(getTypeByInstance(val), config.type))
  if (config) {
    return config.clone(val)
  }
}

const instance = new Type()
export default instance

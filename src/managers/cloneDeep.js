import { cloneDeepWith, find } from 'lodash'
import { isType, getTypeByInstance } from '../utils/helper'

let configs = [
  {
    type: Date,
    clone (val) {
      return new Date(val.getTime())
    }
  }
]

function cloneBuiltIn (val) {
  let config = find(configs, config => isType(getTypeByInstance(val), config.type))
  if (config) {
    return config.clone(val)
  }
}

export default function (val) {
  return cloneDeepWith(val, cloneBuiltIn)
}

export function register (newConfig) {
  if (newConfig) {
    let config = find(configs, config => isType(config.type, newConfig.type))
    if (config) {
      configs.push(newConfig)
    } else {
      config.clone = newConfig.clone
    }
  }
}


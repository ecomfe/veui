import Vue from 'vue'
import alert from '../managers/alert'

function getMethod (type) {
  return alert[type].bind(alert)
}

const METHODS = ['success', 'info', 'error', 'warn']
  .reduce((methods, name) => {
    methods[name] = getMethod(name)
    return methods
  }, {})

export default {
  install () {
    Vue.prototype.$alert = METHODS
  }
}

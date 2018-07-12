import Vue from 'vue'
import confirm from '../managers/confirm'

function getMethod (name) {
  return confirm[name].bind(confirm)
}

const METHODS = ['success', 'info', 'error', 'warn']
  .reduce((methods, name) => {
    methods[name] = getMethod(name)
    return methods
  }, {})

export default {
  install () {
    Vue.prototype.$confirm = METHODS
  }
}

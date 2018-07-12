import Vue from 'vue'
import toast from '../managers/toast'

function getMethod (name) {
  return toast[name].bind(toast)
}

const METHODS = ['success', 'info', 'error', 'warn', 'add', 'remove']
  .reduce((methods, name) => {
    methods[name] = getMethod(name)
    return methods
  }, {})

export default {
  install () {
    Vue.prototype.$toast = METHODS
  }
}

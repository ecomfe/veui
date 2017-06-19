import Vue from 'vue'
import { toast } from '../managers'

function getMethod (name) {
  return toast[name].bind(toast)
}

let methods = ['success', 'warn', 'info', 'error', 'add', 'remove'].map(name => getMethod)

export default {
  install () {
    Vue.prototype.$toast = methods
  }
}

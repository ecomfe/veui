import Vue from 'vue'
import prompt from '../managers/prompt'

function getMethod (name) {
  return prompt[name].bind(prompt)
}

let methods = ['success', 'info', 'error', 'warn'].map(name => getMethod)

export default {
  install () {
    Vue.prototype.$prompt = methods
  }
}

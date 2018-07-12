import Vue from 'vue'
import prompt from '../managers/prompt'

function getMethod (name) {
  return prompt[name].bind(prompt)
}

const METHODS = ['success', 'info', 'error', 'warn']
  .reduce((methods, name) => {
    methods[name] = getMethod(name)
    return methods
  }, {})

export default {
  install () {
    Vue.prototype.$prompt = METHODS
  }
}

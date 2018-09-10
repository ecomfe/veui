import Vue from 'vue'
import { isString, isObject, isNumber } from 'lodash'
import ToastList from '../components/ToastList'
import warn from '../utils/warn'

let Container = Vue.extend(ToastList)

export class ToastManager {
  constructor () {
    this.container = new Container()
  }

  init () {
    let el = document.createElement('div')
    document.body.appendChild(el)
    this.container.$mount(el)
    this.el = el
  }

  add (option) {
    if (!this.el) {
      this.init()
    }

    if (Array.isArray(option)) {
      option.forEach(item => {
        this.container.add(item)
      })
    } else if (isObject(option)) {
      this.container.add(option)
    } else {
      warn('[toast-manager] Invalid arguments for Toasts.')
    }
  }

  remove (index) {
    let container = this.container
    if (isNumber(index)) {
      container.remove(container.messages[index])
      return
    }

    // no valid index, remove until empty
    while (container.messages.length) {
      this.remove(0)
    }
  }

  show (message, type) {
    let options = {}
    if (isObject(message)) {
      options = {...options, ...message}
    } else if (isString(message)) {
      options.message = message
    }
    if (isObject(type)) {
      options = {...options, ...type}
    } else if (isString(type)) {
      options.type = type
    }
    this.add(options)
  }

  success (message) {
    this.show(message, 'success')
  }

  warn (message) {
    this.show(message, 'warning')
  }

  info (message) {
    this.show(message, 'info')
  }

  error (message) {
    this.show(message, 'error')
  }
}

let toast = new ToastManager()
export default toast

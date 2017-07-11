import Vue from 'vue'
import { isString, isObject, isNumber } from 'lodash'
import ToastList from '../components/ToastList'

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
      Vue.util.warn('Invalid arguments for Toasts.')
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

  _show (message, type) {
    let option = message
    if (isString(message)) {
      option = {
        message
      }
    }
    option.type = type
    this.add(option)
  }

  success (message) {
    this._show(message, 'success')
  }

  warn (message) {
    this._show(message, 'warning')
  }

  info (message) {
    this._show(message, 'info')
  }

  error (message) {
    this._show(message, 'error')
  }
}

let toast = new ToastManager()
export default toast

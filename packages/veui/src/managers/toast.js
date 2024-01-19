import Vue from 'vue'
import { isString, isObject, isNumber } from 'lodash'
import ToastList from '../components/ToastList'
import warn from '../utils/warn'
import config from './config'

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

    const theme = config.get('theme')

    let messages = []
    if (Array.isArray(option)) {
      messages = option.map((item) => this.container.add({ theme, ...item }))
    } else if (isObject(option)) {
      messages = [this.container.add({ theme, ...option })]
    } else {
      warn('[toast-manager] Invalid arguments for Toasts.')
    }

    return () => messages.forEach((message) => this.container.remove(message))
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

  show (message, status) {
    let options = {}
    if (isObject(message)) {
      options = { ...message }
    } else if (isString(message)) {
      options.message = message
    }
    if (isObject(status)) {
      options = { ...options, ...status }
    } else if (isString(status)) {
      options.status = status
    }
    return this.add(options)
  }

  success (message, options) {
    return this.show(message, { ...options, status: 'success' })
  }

  warn (message, options) {
    return this.show(message, { ...options, status: 'warning' })
  }

  info (message, options) {
    return this.show(message, { ...options, status: 'info' })
  }

  error (message, options) {
    return this.show(message, { ...options, status: 'error' })
  }
}

let toast = new ToastManager()
export default toast

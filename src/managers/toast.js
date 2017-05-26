import Vue from 'vue'
import { isString, isArray, isObject } from 'lodash'
import ToastList from '../components/ToastList'

let Container = Vue.extend(ToastList)

class ToastManager {

  constructor (option) {
    this.instance = new Container()
    let el = document.createElement('div')
    document.body.appendChild(el)
    this.instance.$mount(el)
    el = null
    if (option) {
      this.add(option)
    }
  }

  add (option) {
    if (isArray(option)) {
      option.forEach(item => {
        this.instance.add(item)
      })
    } else if (isObject(option)) {
      this.instance.add(option)
    } else {
      throw new Error('The toast\'s param is invalid!')
    }
  }

  remove (index) {
    this.instance.remove(this.instance.messages[index])
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

  warning (message) {
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

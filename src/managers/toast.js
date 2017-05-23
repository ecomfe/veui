import Vue from 'vue'
import { isString, isArray, isObject } from 'lodash'

let Container = Vue.extend(require('@/components/ToastList'))

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

  success (option) {
    if (isString(option)) {
      option = {
        type: 'success',
        text: option
      }
    }
    this.add(option)
  }

  warning (option) {
    if (isString(option)) {
      option = {
        type: 'warning',
        text: option
      }
    }
    this.add(option)
  }

  info (option) {
    if (isString(option)) {
      option = {
        type: 'info',
        text: option
      }
    }
    this.add(option)
  }

  error (option) {
    if (isString(option)) {
      option = {
        type: 'error',
        text: option
      }
    }
    this.add(option)
  }
}

export {ToastManager}

let toast = new ToastManager()

export {toast}

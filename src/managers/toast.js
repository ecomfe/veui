import Vue from 'vue'
import { isString, isArray, isObject } from 'lodash'

let Container = Vue.extend(require('@/components/ToastList'))
let instance = new Container()
let el

export function add (option) {
  if (!el) {
    el = document.createElement('div')
    document.body.appendChild(el)
    instance.$mount(el)
  }

  if (isArray(option)) {
    option.forEach(item => {
      instance.add(item)
    })
  } else if (isObject(option)) {
    instance.add(option)
  } else {
    throw new Error('The toast\'s param is invalid!')
  }
}

export function success (option) {
  if (isString(option)) {
    option = {
      type: 'success',
      text: option
    }
  }
  add(option)
}

export function warn (option) {
  if (isString(option)) {
    option = {
      type: 'warn',
      text: option
    }
  }
  add(option)
}

export function remind (option) {
  if (isString(option)) {
    option = {
      type: 'remind',
      text: option
    }
  }
  add(option)
}

export function error (option) {
  if (isString(option)) {
    option = {
      type: 'error',
      text: option
    }
  }
  add(option)
}

export function remove (index) {
  instance.remove(instance.messages[index])
}

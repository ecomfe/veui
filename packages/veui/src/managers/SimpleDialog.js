import Vue from 'vue'
import { remove } from 'lodash'

export default class SimpleDialog {
  components = []

  createComponent (data) {
    const component = new Vue({
      render: h => h()
    })
    return component
  }

  create (data) {
    data.open = true
    const component = this.createComponent(data)
    const el = document.createElement('div')
    document.body.appendChild(el)
    component.$mount(el)
    this.components.push(component)
    return component
  }

  removeComponent (component) {
    remove(this.components, item => item === component)
    component.$destroy()
    component.$el.parentNode.removeChild(component.$el)
  }

  _show () {
    throw new Error('SimpleDialog\'s [_show] method must be implemented.')
  }

  success (content, title, options = {}) {
    return this._show({
      ...options,
      title,
      content,
      type: 'success'
    })
  }

  info (content, title, options = {}) {
    return this._show({
      ...options,
      title,
      content,
      type: 'info'
    })
  }

  error (content, title, options = {}) {
    return this._show({
      ...options,
      title,
      content,
      type: 'error'
    })
  }

  warn (content, title, options = {}) {
    return this._show({
      ...options,
      title,
      content,
      type: 'warning'
    })
  }
}

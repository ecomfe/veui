import Vue from 'vue'
import { remove } from 'lodash'

export default class SpecialDialog {
  type = null
  components = []

  constructor (type) {
    this.type = type
  }

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
  }

  removeComponent (component) {
    remove(this.components, item => item === component)
    component.$destroy()
    component.$el.parentNode.removeChild(component.$el)
  }
}

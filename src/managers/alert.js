import SpecialDialog from './SpecialDialog'
import AlertBox from '../components/AlertBox'
import Vue from 'vue'
import { isFunction } from 'lodash'

export class AlertManager extends SpecialDialog {

  constructor () {
    super(AlertBox)
  }

  createComponent (data) {
    const component = new Vue({
      render: (h) => {
        return h(
          this.Component,
          {
            props: {
              open: data.open,
              title: data.title,
              ui: data.type
            },
            on: {
              ok: () => {
                this.removeComponent(component)
                if (isFunction(data.ok)) {
                  data.ok()
                }
              }
            }
          },
          [
            h('template', { slot: 'default' }, data.content)
          ]
        )
      }
    })
    return component
  }

  success (content, title, options = {}) {
    this.create({
      content,
      title,
      type: 'success',
      ...options
    })
  }

  info (content, title, options = {}) {
    this.create({
      content,
      title,
      type: 'info',
      ...options
    })
  }

  error (content, title, options = {}) {
    this.create({
      content,
      title,
      type: 'error',
      ...options
    })
  }
}

let manager = new AlertManager()
export default manager

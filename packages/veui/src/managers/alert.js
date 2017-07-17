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
          this.type,
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
    return new Promise(resolve => {
      this.create({
        ...options,
        content,
        title,
        type: 'success',
        ok: resolve
      })
    })
  }

  info (content, title, options = {}) {
    return new Promise(resolve => {
      this.create({
        ...options,
        content,
        title,
        type: 'info',
        ok: resolve
      })
    })
  }

  error (content, title, options = {}) {
    return new Promise(resolve => {
      this.create({
        ...options,
        content,
        title,
        type: 'error',
        ok: resolve
      })
    })
  }
}

let manager = new AlertManager()
export default manager

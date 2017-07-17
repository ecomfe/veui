import SpecialDialog from './SpecialDialog'
import ConfirmBox from '../components/ConfirmBox'
import Vue from 'vue'
import { isFunction } from 'lodash'

export class ConfirmManager extends SpecialDialog {

  constructor () {
    super(ConfirmBox)
  }

  createComponent (data) {
    const component = new Vue({
      render: (h) => {
        return h(
          this.type,
          {
            props: {
              open: data.open,
              title: data.title
            },
            on: {
              ok: () => {
                this.removeComponent(component)
                if (isFunction(data.ok)) {
                  data.ok()
                }
              },
              cancel: () => {
                this.removeComponent(component)
                if (isFunction(data.cancel)) {
                  data.cancel()
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

  popup (content, title, options = {}) {
    return new Promise((resolve, reject) => {
      this.create({
        ...options,
        content,
        title,
        ok: resolve,
        cancel: reject
      })
    })
  }
}

let manager = new ConfirmManager()
export default manager

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
          this.Component,
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
    this.create({
      content,
      title,
      ...options
    })
  }
}

let manager = new ConfirmManager()
export default manager

import SpecialDialog from './SpecialDialog'
import PromptBox from '../components/PromptBox'
import Vue from 'vue'
import { isFunction } from 'lodash'

export class PromptManager extends SpecialDialog {

  constructor () {
    super(PromptBox)
  }

  createComponent (data) {
    data.value = data.value || ''
    const component = new Vue({
      render: (h) => {
        return h(
          this.type,
          {
            props: {
              open: data.open,
              title: data.title,
              ui: data.type,
              content: data.content,
              value: data.value
            },
            on: {
              ok: () => {
                this.removeComponent(component)
                if (isFunction(data.ok)) {
                  data.ok(data.value)
                }
              },
              cancel: () => {
                this.removeComponent(component)
                if (isFunction(data.cancel)) {
                  data.cancel()
                }
              },
              input: (v) => {
                data.value = v
              }
            }
          }
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
        ok: value => resolve({ cancelled: false, value }),
        cancel: () => resolve({ cancelled: true })
      })
    })
  }
}

let manager = new PromptManager()
export default manager

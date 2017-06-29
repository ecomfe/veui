import SpecialDialog from './SpecialDialog'
import PromptBox from '../components/PromptBox'
import Vue from 'vue'
import { isFunction } from 'lodash'

export class PromptManager extends SpecialDialog {

  constructor () {
    super(PromptBox)
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
    this.create({
      content,
      title,
      ...options
    })
  }
}

let manager = new PromptManager()
export default manager

import SpecialDialog from './SpecialDialog'
import PromptBox from '../components/PromptBox'
import Vue from 'vue'
import { isFunction, noop } from 'lodash'

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
              ok: () => data.ok(data.value),
              cancel: data.cancel,
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

  _show (options) {
    let ok = isFunction(options.ok) ? options.ok : noop
    let cancel = isFunction(options.cancel) ? options.cancel : noop
    return new Promise((resolve, reject) => {
      let remove = () => this.removeComponent(component)
      let checkRemove = (isOk, value) => {
        (isOk
          ? Promise.resolve(ok({ remove, value }))
          : Promise.resolve(cancel({ remove }))
        ).then(result => {
          if (result !== true) {
            remove()
          }

          isOk ? resolve({ isOk, value }) : resolve(isOk)
        })
      }

      let component = this.create({
        ...options,
        ok: value => checkRemove(true, value),
        cancel: () => checkRemove(false)
      })
    })
  }
}

let manager = new PromptManager()
export default manager

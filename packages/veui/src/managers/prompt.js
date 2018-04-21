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
      render: h => {
        return h(this.type, {
          props: {
            open: data.open,
            title: data.title,
            ui: data.type,
            content: data.content,
            value: data.value,
            overlayClass: data.overlayClass
          },
          on: {
            ok: () => data.ok(data.value),
            cancel: data.cancel,
            input: val => {
              data.value = val
            }
          }
        })
      }
    })
    return component
  }

  _show (options) {
    let ok = isFunction(options.ok) ? options.ok : noop
    let cancel = isFunction(options.cancel) ? options.cancel : noop

    return new Promise((resolve, reject) => {
      let checkRemove = (isOk, value) => {
        Promise.resolve(isOk ? ok() : cancel()).then(result => {
          this.removeComponent(component)
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

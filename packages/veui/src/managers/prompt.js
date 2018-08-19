import SimpleDialog from './simple-dialog'
import PromptBox from '../components/PromptBox'
import Vue from 'vue'
import { pick, isFunction, noop } from 'lodash'

export class PromptManager extends SimpleDialog {
  createComponent (data) {
    data.value = data.value || ''
    const component = new Vue({
      render: h => {
        return h(
          PromptBox,
          {
            props: {
              ...pick(data, ['open', 'title', 'type', 'value', 'overlayClass']),
              beforeClose: () => false
            },
            on: {
              ok: () => data.ok(data.value),
              cancel: data.cancel,
              input: val => {
                data.value = val
              }
            }
          },
          [h('template', { slot: 'default' }, data.content)]
        )
      }
    })
    return component
  }

  _show (options) {
    let ok = isFunction(options.ok) ? options.ok : noop
    let cancel = isFunction(options.cancel) ? options.cancel : noop

    return new Promise(resolve => {
      let checkRemove = value => {
        Promise.resolve(value != null ? ok() : cancel()).then(() => {
          this.removeComponent(component)
          resolve(value)
        })
      }

      let component = this.create({
        ...options,
        ok: value => checkRemove(value || ''),
        cancel: () => checkRemove(null)
      })
    })
  }
}

let manager = new PromptManager()
export default manager

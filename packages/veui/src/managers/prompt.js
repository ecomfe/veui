import SimpleDialog from './simple-dialog'
import PromptBox from '../components/PromptBox'
import Vue from 'vue'
import { pick, isFunction, noop } from 'lodash'

export class PromptManager extends SimpleDialog {
  createComponent (data) {
    const manager = this
    data.value = data.value || ''
    return new Vue({
      data: {
        open: false,
        loading: false,
        invalid: false
      },
      mounted () {
        this.open = true
      },
      render (h) {
        return h(
          PromptBox,
          {
            props: {
              ...pick(data, ['title', 'type', 'value', 'overlayClass']),
              open: this.open,
              invalid: this.invalid,
              loading: this.loading,
              beforeClose: () => false
            },
            on: {
              ok: () => data.ok(data.value),
              cancel: data.cancel,
              input: val => {
                data.value = val
              },
              afterclose: () => {
                manager.removeComponent(this)
              }
            }
          },
          [h('template', { slot: 'default' }, data.content)]
        )
      }
    })
  }

  _show (options) {
    let ok = isFunction(options.ok) ? options.ok : noop
    let cancel = isFunction(options.cancel) ? options.cancel : noop

    return new Promise(resolve => {
      let checkRemove = value => {
        component.loading = true
        Promise.resolve(value != null ? ok(value) : cancel(value)).then(
          returnVal => {
            component.loading = false
            component.invalid = returnVal === false

            if (returnVal !== false) {
              component.open = false
              resolve(value)
            }
          }
        )
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

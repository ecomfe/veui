import SimpleDialog from './simple-dialog'
import ConfirmBox from '../components/ConfirmBox'
import Vue from 'vue'
import { pick, isFunction, noop } from 'lodash'

export class ConfirmManager extends SimpleDialog {
  createComponent (data) {
    const manager = this
    return new Vue({
      data: {
        open: false
      },
      render (h) {
        return h(
          ConfirmBox,
          {
            props: {
              ...pick(data, ['title', 'type', 'overlayClass']),
              open: this.open,
              beforeClose: () => false
            },
            on: {
              ok: data.ok,
              cancel: data.cancel,
              afterclose: () => {
                manager.removeComponent(this)
              }
            }
          },
          [h('template', { slot: 'default' }, data.content)]
        )
      },
      mounted () {
        this.open = true
      }
    })
  }

  _show (options) {
    let ok = isFunction(options.ok) ? options.ok : noop
    let cancel = isFunction(options.cancel) ? options.cancel : noop
    return new Promise(resolve => {
      let checkRemove = isOk => {
        Promise.resolve(isOk ? ok() : cancel()).then(() => {
          component.open = false
          resolve(isOk)
        })
      }

      let component = this.create({
        ...options,
        ok: () => checkRemove(true),
        cancel: () => checkRemove(false)
      })
    })
  }
}

let manager = new ConfirmManager()
export default manager

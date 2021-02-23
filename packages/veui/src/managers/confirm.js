import SimpleDialog from './simple-dialog'
import ConfirmBox from '../components/ConfirmBox'
import Vue from 'vue'
import { pick, isFunction, noop } from 'lodash'

export class ConfirmManager extends SimpleDialog {
  createComponent (data) {
    const manager = this
    return new Vue({
      data: {
        open: false,
        loading: false
      },
      mounted () {
        this.open = true
      },
      render (h) {
        return h(
          ConfirmBox,
          {
            props: {
              ...pick(data, ['title', 'type', 'overlayClass']),
              open: this.open,
              loading: this.loading,
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
      }
    })
  }

  _show (options) {
    let ok = isFunction(options.ok) ? options.ok : noop
    let cancel = isFunction(options.cancel) ? options.cancel : noop
    return new Promise(resolve => {
      let checkRemove = isOk => {
        let result = isOk ? ok() : cancel()
        if (result && isFunction(result.then)) {
          // 如果不是异步就不需要显示 loading
          component.loading = true
        }
        Promise.resolve(result).then(returnVal => {
          component.loading = false
          if (returnVal !== false) {
            component.open = false
            resolve(isOk)
          }
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

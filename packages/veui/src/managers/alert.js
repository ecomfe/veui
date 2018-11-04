import SimpleDialogManager from './simple-dialog'
import AlertBox from '../components/AlertBox'
import Vue from 'vue'
import { isFunction, noop, pick } from 'lodash'

export class AlertManager extends SimpleDialogManager {
  createComponent (data) {
    const manager = this
    return new Vue({
      data: {
        open: false
      },
      render (h) {
        return h(
          AlertBox,
          {
            props: {
              ...pick(data, ['title', 'type', 'overlayClass']),
              open: this.open,
              beforeClose: () => false
            },
            on: {
              ok: data.ok,
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
    return new Promise(resolve => {
      let component = this.create({
        ...options,
        ok: () => {
          Promise.resolve(ok()).then(() => {
            component.open = false
            resolve()
          })
        }
      })
    })
  }
}

let manager = new AlertManager()
export default manager

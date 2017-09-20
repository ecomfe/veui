import SpecialDialog from './SpecialDialog'
import ConfirmBox from '../components/ConfirmBox'
import Vue from 'vue'
import { isFunction, noop } from 'lodash'

export class ConfirmManager extends SpecialDialog {

  constructor () {
    super(ConfirmBox)
  }

  createComponent (data) {
    const component = new Vue({
      render: (h) => {
        return h(
          this.type,
          {
            props: {
              open: data.open,
              title: data.title,
              ui: data.type,
              overlayClass: data.overlayClass
            },
            on: {
              ok: data.ok,
              cancel: data.cancel
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

  _show (options) {
    let ok = isFunction(options.ok) ? options.ok : noop
    let cancel = isFunction(options.cancel) ? options.cancel : noop
    return new Promise((resolve, reject) => {
      let checkRemove = (isOk) => {
        Promise.resolve(isOk ? ok() : cancel()).then(result => {
          this.removeComponent(component)
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

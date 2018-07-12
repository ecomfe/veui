import SimpleDialog from './SimpleDialog'
import ConfirmBox from '../components/ConfirmBox'
import Vue from 'vue'
import { pick, isFunction, noop } from 'lodash'

export class ConfirmManager extends SimpleDialog {
  createComponent (data) {
    const component = new Vue({
      render: h => {
        return h(
          ConfirmBox,
          {
            props: pick(data, ['open', 'title', 'type', 'overlayClass', 'beforeClose']),
            on: {
              ok: data.ok,
              cancel: data.cancel
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
      let checkRemove = isOk => {
        Promise.resolve(isOk ? ok() : cancel()).then(() => {
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

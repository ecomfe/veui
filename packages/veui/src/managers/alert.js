import SimpleDialogManager from './simple-dialog'
import AlertBox from '../components/AlertBox'
import Vue from 'vue'
import { isFunction, noop, pick } from 'lodash'

export class AlertManager extends SimpleDialogManager {
  createComponent (data) {
    const component = new Vue({
      render: h => {
        return h(
          AlertBox,
          {
            props: pick(data, ['open', 'title', 'type', 'overlayClass', 'beforeClose']),
            on: {
              ok: data.ok
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
    return new Promise(resolve => {
      let component = this.create({
        ...options,
        ok: () => {
          Promise.resolve(ok()).then(() => {
            this.removeComponent(component)
            resolve()
          })
        }
      })
    })
  }
}

let manager = new AlertManager()
export default manager

import SpecialDialog from './SpecialDialog'
import AlertBox from '../components/AlertBox'
import Vue from 'vue'
import { isFunction, noop, pick } from 'lodash'

export class AlertManager extends SpecialDialog {
  constructor () {
    super(AlertBox)
  }

  createComponent (data) {
    const component = new Vue({
      render: (h) => {
        return h(
          this.type,
          {
            props: pick(data, ['open', 'title', 'type', 'overlayClass']),
            on: {
              ok: data.ok
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
    return new Promise(resolve => {
      let component = this.create({
        ...options,
        ok: () => {
          Promise.resolve(ok())
            .then(result => {
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

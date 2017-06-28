import Vue from 'vue'
import OverlayList from '../components/OverlayList'

let Container = Vue.extend(OverlayList)

export class OverlayListManager {

  constructor () {
    this.container = new Container()
  }

  init () {
    let el = document.createElement('div')
    document.body.appendChild(el)
    this.container.$mount(el)
    this.el = el
  }

  toast (type, message) {
    this.container.popup('toast', { type, message })
  }

  alert (type, { content, title, ok } = {}) {
    this.container.popup('alert', { type, content, title, ok })
  }

  confirm ({ content, title, ok, cancel } = {}) {
    this.container.popup('confirm', { content, title, ok, cancel })
  }

  prompt ({ content, title, ok, cancel } = {}) {
    this.container.popup('prompt', { content, title, ok, cancel })
  }
}

let manager = new OverlayListManager()
export default manager

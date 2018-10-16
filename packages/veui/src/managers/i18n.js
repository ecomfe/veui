import { set, get, isString, isFunction, pull } from 'lodash'
import warn from '../utils/warn'

export class I18nManager {
  store = {};

  _locale = 'zh-Hans';

  get locale () {
    return this._locale
  }

  set locale (val) {
    if (val === this._locale) {
      return
    }

    if (!this.store[val]) {
      warn(`[veui-i18n] Locale \`${val}\` not found. Please register locale data before use.`)
    }

    this._locale = val
    this.deps.forEach(dep => {
      if (isFunction(dep.$forceUpdate)) {
        dep.$forceUpdate()
      }
    })
  }

  deps = []

  register (locale, data, options = {}) {
    let key = options.ns ? `${locale}.${options.ns}` : `${locale}`
    set(this.store, key, data)
  }

  get (path, data = {}, locale) {
    let key = `${locale || this.locale}.${path}`
    let message = get(this.store, key)

    if (!isString(message)) {
      return message
    }

    return message.replace(/\{(\w+)\}/g, (_, key) => {
      return data[key]
    })
  }

  subscribe (ob) {
    this.deps.push(ob)
  }

  unsubscribe (ob) {
    pull(this.deps, ob)
  }
}

export default new I18nManager()

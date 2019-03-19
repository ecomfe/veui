import Vue from 'vue'
import { isString, isFunction, get } from 'lodash'
import { deepSet } from '../utils/helper'
import warn from '../utils/warn'

export class I18nManager {
  store = new Vue({
    data: {
      locale: process.env.VEUI_LOCALE || 'zh-Hans',
      store: {}
    },
    methods: {
      register (locale, data, options = {}) {
        let key = options.ns ? `${locale}.${options.ns}` : `${locale}`
        deepSet(this.store, key, data)
      },
      get (path, data, locale) {
        if (isString(data)) {
          // overloading get (path, locale)
          locale = data
        }

        let key = `${locale || this.locale}.${path}`
        let message = get(this.store, key)

        if (!isString(message)) {
          return message
        }

        return message.replace(/\{(\w+)\}/g, (_, key) => {
          return data[key]
        })
      },
      watch (path, callback, locale) {
        return this.$watch(
          () => this.get(path, locale),
          val => {
            if (isFunction(callback)) {
              callback(val)
            }
          }
        )
      }
    }
  })

  _locale = 'zh-Hans'

  get locale () {
    return this.store.locale
  }

  set locale (val) {
    if (val === this.store.locale) {
      return
    }

    if (!this.store.store[val]) {
      warn(
        `[veui-i18n] Locale \`${val}\` not found. Please register locale data before use.`
      )
    }

    this.store.locale = val
  }

  register (locale, data, options) {
    this.store.register(locale, data, options)
  }

  get (path, data, locale) {
    return this.store.get(path, data, locale)
  }

  watch (path, callback, locale) {
    return this.store.watch(path, callback, locale)
  }
}

export default new I18nManager()

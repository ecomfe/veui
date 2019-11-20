import { isObject, startsWith, forEach } from 'lodash'
import Vue from 'vue'
import i18n from './i18n'

export class ConfigManager {
  store = new Vue({
    data: {
      store: {},
      watchers: {}
    },
    methods: {
      setConfig (obj, key, val, ns, override) {
        if (isObject(key)) {
          ns = val
          val = key
          Object.keys(val).forEach(k => {
            this.setConfig(obj, k, val[k], ns, override)
          })
          return
        }

        if (typeof key !== 'string') {
          throw new Error('`Config key must be a string value.')
        }

        let k = ns ? `${ns}.${key}` : key
        if (!(k in obj) || override) {
          this.setConfigItem(obj, k, val)
        }
      },
      setConfigItem (obj, key, val) {
        Vue.set(obj, key, val)

        let relatedWatcherKeys = Object.keys(this.watchers).filter(k =>
          startsWith(k, key)
        )
        relatedWatcherKeys.forEach(watcherKey => this.unwatch(watcherKey))

        this.transformValue(obj, key, null)
      },
      transformValue (context, key, path) {
        let watcherKey = path ? `${path}.${key}` : key
        let val = context[key]

        let watcher = this.watchers[watcherKey]
        if (typeof val === 'string') {
          if (startsWith(val, '@@')) {
            let i18nKey = val.substring(2)
            if (watcher && watcher.key !== i18nKey) {
              // already watched another i18n key before, unwatch it
              watcher.unwatch()
            }
            this.watchers[watcherKey] = {
              key: i18nKey,
              unwatch: i18n.watch(i18nKey, val => {
                context[key] = val
              })
            }
            context[key] = i18n.get(i18nKey)
          }
        } else if (isObject(val) || Array.isArray(val)) {
          // recursively replace pointers
          forEach(val, (_, k) => {
            this.transformValue(val, k, watcherKey)
          })
        }
      },
      unwatch (key) {
        let watcher = this.watchers[key]
        if (watcher) {
          watcher.unwatch()
          delete this.watchers[key]
        }
      },
      set (key, val, ns) {
        this.setConfig(this.store, key, val, ns, true)
      },
      defaults (key, val, ns) {
        this.setConfig(this.store, key, val, ns, false)
      },
      get (key) {
        return this.store[key]
      }
    }
  })

  set (key, val, ns) {
    this.store.set(key, val, ns)
  }

  defaults (key, val, ns) {
    this.store.defaults(key, val, ns)
  }

  get (path) {
    return this.store.get(path)
  }
}

export default new ConfigManager()

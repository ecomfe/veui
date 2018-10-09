import { getConfigKey } from '../utils/helper'
import warn from '../utils/warn'
import config from '../managers/config'
import { compact, uniq, find, includes, get, merge, keys, pickBy } from 'lodash'

export default {
  props: {
    ui: String
  },
  computed: {
    uiParts () {
      return this.getComponentConfig('parts') || {}
    },
    uiProps () {
      let ui = (this.ui || '').trim()
      let tokens = compact(uniq(ui.split(/\s+/)))
      let { uiConfig = {} } = this
      return tokens.reduce(
        (result, token) => {
          let name = find(keys(uiConfig), name => {
            let { boolean = false, values = [] } = uiConfig[name]
            if (boolean) {
              return token === name
            }
            return includes(values, token)
          })
          if (name) {
            if (result[name] && result[name] !== 'default') {
              warn(
                `[${
                  this.$options.name
                }] Duplicated \`${name}\` value for \`ui\`: [${
                  result[name]
                }], [${token}].`
              )
            }
            let { boolean } = uiConfig[name]
            if (boolean) {
              result[name] = true
            } else {
              result[name] = token
            }
          }
          return result
        },
        keys(uiConfig).reduce((result, name) => {
          let prop = uiConfig[name]
          if (prop.boolean) {
            result[name] = false
          } else {
            result[name] = prop.default || 'default'
          }
          return result
        }, {})
      )
    },
    uiConfig () {
      return this.getComponentConfig('ui')
    },
    uiData () {
      let { uiConfig = {}, uiProps } = this
      return keys(uiProps).reduce((result, name) => {
        let data = get(uiConfig[name], ['data', uiProps[name]], {})
        merge(result, data)
        return result
      }, {})
    },
    icons () {
      let icons = this.getComponentConfig('icons')
      let uiIcons = this.uiData.icons || {}

      return {
        ...icons,
        ...uiIcons
      }
    },
    inheritedUiProps () {
      if (!this.uiConfig) {
        return this.ui
      }

      return pickBy(this.uiProps, (val, key) => {
        let uiProp = this.uiConfig[key]
        return !!uiProp.inherit
      })
    },
    realUi () {
      // merge ui & $parent's inheritedUi
      let { uiProps = {} } = this
      let overrides = pickBy(uiProps, (val, key) => {
        return val !== 'default' || val === true
      })
      let { inheritedUiProps = {} } = this.$parent || {}
      let props = { ...inheritedUiProps, ...overrides }
      return keys(props).map(key => {
        if (props[key] === true) {
          return key
        }
        return props[key]
      }).filter(val => val !== 'default').join(' ') || null
    }
  },
  methods: {
    getComponentConfig (key) {
      return config.get(`${getConfigKey(this.$options.name)}.${key}`)
    }
  }
}

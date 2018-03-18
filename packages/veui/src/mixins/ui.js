import { getConfigKey } from '../utils/helper'
import warn from '../utils/warn'
import config from '../managers/config'
import { compact, uniq, find, includes, get, assign, filter } from 'lodash'

export default {
  props: {
    ui: String
  },
  computed: {
    uiProps () {
      let ui = (this.ui || '').trim()
      if (!ui) {
        return {}
      }
      let tokens = compact(uniq(ui.split(/\s+/)))
      let { uiConfig = {} } = this
      return tokens.reduce((result, token) => {
        let name = find(Object.keys(uiConfig), name => {
          let { values = [] } = uiConfig[name]
          return includes(values, token)
        })
        if (name) {
          if (result[name]) {
            warn(`Duplicated \`${name}\` value for [${this.$options.name}]'s \`ui\` prop: [${result[name]}], [${token}].`)
          }
          result[name] = token
        }
        return result
      }, {})
    },
    uiConfig () {
      return this.getComponentConfig('ui')
    },
    icons () {
      let icons = this.getComponentConfig('icons')
      let { uiConfig = {}, uiProps } = this

      let uiIcons = Object.keys(uiProps).reduce((result, name) => {
        let icons = get(uiConfig[name], 'data.icons', {})
        assign(result, icons[uiProps[name]])
        return result
      }, {})

      return {
        ...icons,
        ...uiIcons
      }
    },
    inheritedUi () {
      if (!this.uiConfig) {
        return this.ui
      }
      return filter(this.uiProps, (val, key) => {
        let uiProp = this.uiConfig[key]
        return !uiProp || uiProp.inherit !== false
      }).join(' ')
    }
  },
  methods: {
    getComponentConfig (key) {
      return config.get(`${getConfigKey(this.$options.name)}.${key}`)
    }
  }
}

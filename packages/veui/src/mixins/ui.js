import { getConfigKey, findAncestor, isType } from '../utils/helper'
import warn from '../utils/warn'
import config from '../managers/config'
import {
  compact,
  uniq,
  find,
  includes,
  get,
  merge,
  pickBy,
  mapValues
} from 'lodash'

const UNKNOWN_KEY = '$unknown'
const DEFAULT_VAL = '__default__'

function callWithProps (val, props) {
  if (typeof val === 'function') {
    return val(props)
  }
  return val
}

export default {
  props: {
    ui: String
  },
  computed: {
    uiParts () {
      let parts = this.getComponentConfig('parts') || {}
      return mapValues(parts, ui => callWithProps(ui, this.uiProps))
    },
    declaredUiProps () {
      let ui = (this.ui || '').trim()
      let tokens = compact(uniq(ui.split(/\s+/)))
      let { uiConfig = {} } = this
      return tokens.reduce(
        (result, token) => {
          let name = find(Object.keys(uiConfig), name => {
            let { boolean = false, values = [] } = uiConfig[name]
            if (boolean) {
              return token === name
            }
            return includes(values, token)
          })
          if (name) {
            if (
              result[name] &&
              result[name] !== DEFAULT_VAL &&
              result[name] !== uiConfig[name].default
            ) {
              warn(
                `[${this.$options.name}] Duplicated \`${name}\` value for \`ui\`: [${result[name]}], [${token}].`
              )
            }
            let { boolean } = uiConfig[name]
            if (boolean) {
              result[name] = true
            } else {
              result[name] = token
            }
          } else {
            result[UNKNOWN_KEY].push(token)
          }
          return result
        },
        {
          [UNKNOWN_KEY]: []
        }
      )
    },
    defaultUiProps () {
      let { uiConfig = {} } = this
      return Object.keys(uiConfig).reduce((result, name) => {
        result[name] = null
        let prop = uiConfig[name]
        if (prop.boolean) {
          result[name] = false
        } else {
          result[name] = prop.default || DEFAULT_VAL
        }
        return result
      }, {})
    },
    inheritableUiProps () {
      if (!this.uiConfig) {
        return this.uiProps
      }

      return pickBy(this.uiProps, (val, key) => {
        let uiProp = this.uiConfig[key]
        return val !== DEFAULT_VAL && uiProp && uiProp.inherit
      })
    },
    uiProps () {
      let { inheritableUiProps = {} } =
        findAncestor(this, component => !isType(component, 'transparent')) || {}

      return {
        ...this.defaultUiProps,
        ...inheritableUiProps,
        ...this.declaredUiProps
      }
    },
    uiConfig () {
      return this.getComponentConfig('ui')
    },
    uiData () {
      let { uiConfig = {}, uiProps } = this
      return Object.keys(uiProps)
        .filter(name => name !== UNKNOWN_KEY)
        .reduce((result, name) => {
          let data = get(uiConfig[name], ['data', uiProps[name]], {})
          merge(result, data)
          return result
        }, {})
    },
    icons () {
      let icons = this.getComponentConfig('icons')
      if (typeof icons === 'function') {
        return icons(this.uiProps)
      }

      let uiIcons = this.uiData.icons || {}

      return mapValues(
        {
          ...icons,
          ...uiIcons
        },
        ui => callWithProps(ui, this.uiProps)
      )
    },
    realUi () {
      let props = this.uiProps
      return (
        uniq(
          Object.keys(props)
            .map(key => {
              if (props[key] === true) {
                return key
              }
              return key === UNKNOWN_KEY ? null : props[key]
            })
            .filter(val => val && val !== DEFAULT_VAL && val !== false)
            .concat(this.declaredUiProps[UNKNOWN_KEY])
        ).join(' ') || null
      )
    }
  },
  methods: {
    getComponentConfig (key) {
      return config.get(`${getConfigKey(this.$options.name)}.${key}`)
    }
  }
}

import {
  compact,
  uniq,
  find,
  includes,
  get,
  merge,
  assign,
  pickBy,
  mapValues
} from 'lodash'
import { getConfigKey, findAncestor, isTransparent } from '../utils/helper'
import warn from '../utils/warn'
import { configContext } from '../managers/config'
import prefix from './prefix'

const UNKNOWN_KEY = '$unknown'
const DEFAULT_VAL = '__default__'

function callWithProps (val, props) {
  if (typeof val === 'function') {
    return val(props)
  }
  return val
}

export function useUi () {
  return {
    props: {
      ui: String
    },
    mixins: [configContext.useConsumer('__veui_config'), prefix],
    computed: {
      uiParts () {
        const parts = this.getComponentConfig('parts') || {}
        return mapValues(parts, (ui) => callWithProps(ui, this.uiProps))
      },
      declaredUiProps () {
        const ui = (this.ui || '').trim()
        const tokens = compact(uniq(ui.split(/\s+/)))
        const { uiConfig = {} } = this
        return tokens.reduce(
          (result, token) => {
            const name = find(Object.keys(uiConfig), (name) => {
              const { boolean = false, values = [] } = uiConfig[name]
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
              const { boolean } = uiConfig[name]
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
        const { uiConfig = {} } = this
        return Object.keys(uiConfig).reduce((result, name) => {
          result[name] = null
          const prop = uiConfig[name]
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
          const uiProp = this.uiConfig[key]
          return val !== DEFAULT_VAL && uiProp && uiProp.inherit
        })
      },
      uiProps () {
        const { inheritableUiProps = {} } =
          findAncestor(this, (component) => !isTransparent(component)) || {}

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
        const { uiConfig = {}, uiProps } = this
        return Object.keys(uiProps)
          .filter((name) => name !== UNKNOWN_KEY)
          .reduce((result, name) => {
            const data = get(uiConfig[name], ['data', uiProps[name]], {})
            merge(result, data)
            return result
          }, {})
      },
      icons () {
        const icons = this.getComponentConfig('icons')
        if (typeof icons === 'function') {
          return icons(this.uiProps)
        }

        const uiIcons = this.uiData.icons || {}

        return mapValues(
          {
            ...icons,
            ...uiIcons
          },
          (ui) => callWithProps(ui, this.uiProps)
        )
      },
      illustrations () {
        const illustrations = this.getComponentConfig('illustrations')
        if (typeof illustrations === 'function') {
          return illustrations(this.uiProps)
        }
        return illustrations
      },
      realUi () {
        const props = this.uiProps
        return (
          uniq(
            Object.keys(props)
              .map((key) => {
                if (props[key] === true) {
                  return key
                }
                return key === UNKNOWN_KEY ? null : props[key]
              })
              .filter((val) => val && val !== DEFAULT_VAL && val !== false)
              .concat(this.declaredUiProps[UNKNOWN_KEY])
              .concat(this.themeBase ? `theme:${this.themeBase}` : [])
          ).join(' ') || null
        )
      }
    },
    methods: {
      getComponentConfig (key) {
        const prefix = getConfigKey(this.$options.name)
        const config = this.__veui_config[`${prefix}.${key}`]

        // ui config is not overridable by themes
        if (key === 'ui') {
          return config
        }

        // icons/illustrations/parts can be configured by themes
        const themes = this.__veui_config[`${prefix}.themes`]

        const theme = this.themeBase
        if (themes && themes[theme]) {
          const themeConfig = themes[theme][key]
          if (themeConfig) {
            return assign({}, config, themeConfig)
          }
        }

        return config
      }
    }
  }
}

export default useUi()

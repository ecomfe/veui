import config, { configContext } from '../managers/config'
import { assign, pick, upperFirst } from 'lodash'

export default function useConfig (injectionKey, configPrefixes = ['']) {
  const internalKey = '__veui_config' // 直接固定保留吧，保证多次 useConfig 时可以复用统一注入逻辑
  configPrefixes = Array.isArray(configPrefixes)
    ? configPrefixes
    : [configPrefixes]
  const keys = Object.keys(config.getAll()).filter(k =>
    configPrefixes.some(cp => cp === k || k.indexOf(`${cp}.`) === 0)
  )
  return {
    ...configContext.useConsumer(internalKey),
    data () {
      return {
        // 实际组件依赖这个state，避免类似 datepicker.xxx 影响 Alert 组件
        [injectionKey]: keys.reduce((acc, key) => {
          acc[key] = undefined
          return acc
        }, {})
      }
    },
    watch: {
      [internalKey]: {
        handler (newVal) {
          assign(this[injectionKey], pick(newVal, keys))
        },
        immediate: true
      }
    }
  }
}

// 先取 prop，没有再取 context。
export function useConfigurable (injectionKey, configurable) {
  // normalize
  const realConfigurable = map(configurable, conf => {
    let realConf = typeof conf === 'string' ? { namespace: conf } : conf
    realConf.props = map(realConf.props, prop =>
      typeof prop === 'string' ? { prop } : prop
    )
    return realConf
  })

  // generate computeds
  const namespaces = realConfigurable.map(i => i.namespace)
  return {
    mixins: [useConfig(injectionKey, namespaces)],
    computed: realConfigurable.reduce((acc, { namespace, props }) => {
      return props.reduce((acc, { prop, computed }) => {
        acc[computed || `real${upperFirst(prop)}`] = function () {
          return this[prop] == null
            ? this[injectionKey][`${namespace}.${prop}`]
            : this[prop]
        }
        return acc
      }, acc)
    }, {})
  }
}

function map (target, iterator) {
  return (Array.isArray(target) ? target : target == null ? [] : [target]).map(
    iterator
  )
}

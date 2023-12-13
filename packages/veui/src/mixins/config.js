import config, { configContext } from '../managers/config'
import { assign, pick, upperFirst } from 'lodash'

const { useProvider, useConsumer } = configContext

const internalKey = '__veui_config' // 直接固定保留吧，保证多次 useConfig 时可以复用统一注入逻辑

// useConfig('foo', ['bar']): 将 ConfigProvider 中的配置项 bar/bar.* 读取到 this.foo 中去
export default function useConfig (
  injectionKey,
  configPrefixes = [''],
  override
) {
  configPrefixes = Array.isArray(configPrefixes)
    ? configPrefixes
    : [configPrefixes]
  const keys = Object.keys(config.getAll()).filter((k) =>
    configPrefixes.some(
      (cp) =>
        cp === k ||
        k.indexOf(`${cp}.`) === 0 || // `table.loadingOptions`
        (cp === '' && k.indexOf('.') === -1) // global config like `theme`
    )
  )
  return {
    mixins: [useConsumer(internalKey), useProvider(internalKey, { override })],
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
          // watch 合并策略是合并成数组
          assign(this[injectionKey], pick(newVal, keys))
        },
        immediate: true
      }
    }
  }
}

// useConfigurable('config', {
//   namespace: 'uploader',
//   props: [
//     'headers', // string | {prop: 'headers', computed: 'realHeaders'}
//     'requestMode'
//   ]
// })
// 1. 先从 ConfigProvider 中读取配置项 uploader.headers、uploader.requestMode 到 this.config
// 2. props.headers 覆盖 ConfigProvider中 的 uploader.headers
// 3. this.realHeaders 是最终使用的值，realRequestMode也是如此
export function useConfigurable (injectionKey, configurable) {
  // normalize
  const realConfigurable = map(configurable, (conf) => {
    let realConf = typeof conf === 'string' ? { namespace: conf } : conf
    realConf.props = map(realConf.props, (prop) =>
      typeof prop === 'string' ? { prop } : prop
    )
    return realConf
  })

  function override () {
    return realConfigurable.reduce((acc, { namespace, props }) => {
      return props.reduce((acc, { prop, computed }) => {
        if (typeof this[prop] !== 'undefined') {
          acc[namespace ? `${namespace}.${prop}` : prop] =
            this[computed || `real${upperFirst(prop)}`]
        }

        return acc
      }, acc)
    }, {})
  }

  // generate computeds
  const namespaces = realConfigurable.map((i) => i.namespace || '')
  return {
    mixins: [useConfig(injectionKey, namespaces, override)],
    computed: realConfigurable.reduce((acc, { namespace, props }) => {
      return props.reduce((acc, { prop, computed }) => {
        acc[computed || `real${upperFirst(prop)}`] = function () {
          return typeof this[prop] === 'undefined'
            ? this[injectionKey][namespace ? `${namespace}.${prop}` : prop]
            : this[prop]
        }
        return acc
      }, acc)
    }, {})
  }
}

function map (target, iterator) {
  // 不用 _.map 的原因是 target 不是数组时不要当成对象的 map
  return (Array.isArray(target) ? target : target == null ? [] : [target]).map(
    iterator
  )
}

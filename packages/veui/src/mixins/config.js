import config, { configContext } from '../managers/config'
import { assign, pick } from 'lodash'

function factory (injectionKey, configPrefixes = ['']) {
  const internalKey = '__veui_config' // 直接固定保留吧，保证多次 useConfig 时可以复用统一注入逻辑
  configPrefixes = Array.isArray(configPrefixes)
    ? configPrefixes
    : [configPrefixes]
  const keys = Object.keys(config.getAll()).filter(k =>
    configPrefixes.some(cp => k.indexOf(cp) === 0)
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

export default factory

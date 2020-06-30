import { IconLoading } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      loading: IconLoading
    },
    ui: {
      style: {
        values: ['normal', 'basic', 'translucent', 'primary', 'text', 'icon'],
        default: 'normal'
      },
      strength: {
        values: ['strong', 'aux']
      },
      size: {
        values: ['xs', 's', 'm', 'l', 'xl'],
        default: 'm'
      },
      shape: {
        values: ['square']
      }
    },
    parts: {
      self: ({ style }) => (style === 'icon' ? 'aux' : '')
    }
  },
  'button'
)

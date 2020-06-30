import { IconMinus, IconCheck } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      indeterminate: IconMinus,
      checked: IconCheck
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      }
    }
  },
  'checkbox'
)

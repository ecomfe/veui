import { IconChevronDown } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expand: IconChevronDown,
      collapse: IconChevronDown
    },
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true,
        default: 'm'
      },
      style: {
        values: ['primary', 'basic', 'normal'],
        default: 'basic',
        inherit: true
      },
      role: {
        values: ['text'],
        inherit: true
      }
    },
    parts: {
      search: 'inline'
    }
  },
  'dropdown'
)

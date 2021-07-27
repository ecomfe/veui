import { IconChevronDown } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
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

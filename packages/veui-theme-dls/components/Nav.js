import { IconChevronDown, IconEllipsis } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expand: IconChevronDown,
      more: IconEllipsis
    },
    ui: {
      size: {
        values: ['s', 'm', 'l'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      toggle: 'icon aux'
    }
  },
  'nav'
)

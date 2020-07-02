import { IconChevronRight, IconEllipsis } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expand: IconChevronRight,
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

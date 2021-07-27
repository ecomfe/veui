import { IconChevronRight } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      expand: IconChevronRight,
      collapse: IconChevronRight
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
  'menu'
)

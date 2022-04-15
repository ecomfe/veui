import { IconChevronRight, IconHamburger } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      toggle: IconHamburger,
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
  'sidenav'
)

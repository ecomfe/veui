import { IconChevronRight } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    },
    icons: {
      collapse: IconChevronRight,
      expand: IconChevronRight
    }
  },
  'collapse'
)

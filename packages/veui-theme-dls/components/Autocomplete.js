import ui from 'veui/managers/ui'
import { IconChevronRight } from 'dls-icons-vue'

ui.defaults(
  {
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        default: 'm',
        inherit: true
      }
    },
    icons: {
      separator: IconChevronRight
    }
  },
  'autocomplete'
)

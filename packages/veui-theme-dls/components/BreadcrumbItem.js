import { IconChevronRight } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      separator: IconChevronRight
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true,
        default: 'm'
      },
      style: {
        values: ['normal', 'strong'],
        inherit: true
      }
    }
  },
  'breadcrumbitem'
)

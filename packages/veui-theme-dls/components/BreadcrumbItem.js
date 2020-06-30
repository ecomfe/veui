import { IconChevronRight } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
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

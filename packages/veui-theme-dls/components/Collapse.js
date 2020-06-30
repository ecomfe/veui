import { IconChevronRight } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
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

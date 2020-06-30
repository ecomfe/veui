import { IconChevronRight } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expandable: IconChevronRight
    },
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true
      }
    }
  },
  'optiongroup'
)

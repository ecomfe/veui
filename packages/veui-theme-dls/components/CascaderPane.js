import { IconChevronRight } from 'dls-icons-vue'
import config from 'veui/managers/config'

const CHECKBOX_SIZE_MAP = {
  xs: 's',
  s: 's',
  m: 'm',
  l: 'm'
}

config.defaults(
  {
    icons: {
      expandable: IconChevronRight
    },
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      checkbox: ({ size }) => CHECKBOX_SIZE_MAP[size] || size
    }
  },
  'cascaderpane'
)

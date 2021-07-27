import { IconChevronDown, IconTimesCircle } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

const CHECKBOX_SIZE_MAP = {
  xs: 's',
  s: 's',
  m: 'm',
  l: 'm'
}

const TAG_SIZE_MAP = {
  xs: 's',
  s: 's',
  m: 's',
  l: 'm'
}

ui.defaults(
  {
    icons: {
      expand: IconChevronDown,
      collapse: IconChevronDown,
      clear: IconTimesCircle
    },
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      clear: 'icon aux',
      checkbox: ({ size }) => CHECKBOX_SIZE_MAP[size] || size,
      tag: ({ size }) => TAG_SIZE_MAP[size] || size
    }
  },
  'select'
)

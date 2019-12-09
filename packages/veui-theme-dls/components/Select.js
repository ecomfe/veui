import 'veui-theme-dls-icons/chevron-down'
import 'veui-theme-dls-icons/times-circle'
import config from 'veui/managers/config'

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

config.defaults(
  {
    icons: {
      expand: 'chevron-down',
      collapse: 'chevron-down',
      clear: 'times-circle'
    },
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      clear: 'icon',
      checkbox: ({ size }) => CHECKBOX_SIZE_MAP[size] || size,
      tag: ({ size }) => TAG_SIZE_MAP[size] || size
    }
  },
  'select'
)

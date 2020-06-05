import 'veui-theme-dls-icons/chevron-right'
import 'veui-theme-dls-icons/ellipsis'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expand: 'chevron-right',
      more: 'ellipsis'
    },
    ui: {
      size: {
        values: ['s', 'm', 'l'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      toggle: 'text'
    }
  },
  'nav'
)

import 'veui-theme-one-icons/chevron-down'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expand: 'chevron-down',
      collapse: 'chevron-down'
    },
    ui: {
      style: {
        values: ['alt'],
        inherit: true
      }
    },
    parts: {
      xs: 'xs',
      s: 's',
      m: 'm',
      l: 'l'
    }
  },
  'select'
)

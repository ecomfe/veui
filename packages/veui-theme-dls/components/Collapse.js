import 'veui-theme-one-icons/chevron-right'
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
      collapse: 'chevron-right',
      expand: 'chevron-right'
    }
  },
  'collapse'
)

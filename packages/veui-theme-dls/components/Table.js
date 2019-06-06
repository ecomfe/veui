import 'veui-theme-one-icons/chevron-right'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expand: 'chevron-right',
      collapse: 'chevron-right'
    },
    ui: {
      slim: {
        boolean: true
      },
      alt: {
        boolean: true
      },
      bordered: {
        boolean: true
      }
    }
  },
  'table'
)

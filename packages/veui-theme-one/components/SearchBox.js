import 'veui-theme-one-icons/search'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      search: 'search'
    },
    parts: {
      button: 'primary'
    },
    ui: {
      style: {
        values: ['primary']
      },
      size: {
        values: ['large', 'small'],
        inherit: true
      }
    }
  },
  'search-box'
)

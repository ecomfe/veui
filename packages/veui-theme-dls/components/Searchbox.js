import 'veui-theme-one-icons/search'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      search: 'search'
    },
    parts: {
      button: 'primary',
      search: 'icon'
    },
    ui: {
      style: {
        values: ['normal', 'strong']
      },
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true
      }
    }
  },
  'searchbox'
)

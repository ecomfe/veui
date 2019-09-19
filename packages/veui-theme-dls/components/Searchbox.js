import 'veui-theme-dls-icons/search'
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
        values: ['normal', 'inline', 'strong'],
        inherit: true
      },
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true
      }
    }
  },
  'searchbox'
)

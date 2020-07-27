import { IconSearch } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      search: IconSearch
    },
    parts: {
      button: 'primary square',
      search: 'icon aux'
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

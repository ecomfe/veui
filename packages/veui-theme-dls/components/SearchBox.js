import { IconSearch } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
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
        inherit: true,
        default: 'm'
      }
    }
  },
  'searchbox'
)

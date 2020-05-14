import 'veui-theme-dls-icons/times-circle'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      clear: 'times-circle'
    },
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true
      }
    },
    parts: {
      clear: 'text'
    }
  },
  'input'
)

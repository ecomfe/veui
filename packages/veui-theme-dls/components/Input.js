import 'veui-theme-one-icons/times'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      remove: 'times'
    },
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true
      }
    },
    parts: {
      clear: 'icon'
    }
  },
  'input'
)

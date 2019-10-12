import config from 'veui/managers/config'
import 'veui-theme-dls-icons/times'

config.defaults(
  {
    icons: {
      close: 'times'
    },
    ui: {
      borderless: {
        boolean: true
      },
      reverse: {
        boolean: true
      },
      size: {
        values: ['s', 'm'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      close: 'icon'
    }
  },
  'tag'
)

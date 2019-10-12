import 'veui-theme-dls-icons/loading'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      loading: 'loading'
    },
    ui: {
      style: {
        values: ['normal', 'strong', 'reverse']
      },
      size: {
        values: ['s', 'm', 'l'],
        inherit: true,
        default: 'm'
      },
      direction: {
        values: ['vertical']
      }
    }
  },
  'loading'
)

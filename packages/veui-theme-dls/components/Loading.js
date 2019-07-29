import 'veui-theme-one-icons/spinner'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      loading: 'spinner'
    },
    ui: {
      style: {
        values: ['normal', 'strong', 'reverse']
      },
      size: {
        values: ['s', 'm', 'l']
      },
      direction: {
        values: ['vertical']
      }
    }
  },
  'loading'
)

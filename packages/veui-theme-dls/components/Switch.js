import 'veui-theme-one-icons/spinner'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      loading: 'spinner'
    },
    ui: {
      size: {
        values: ['xs', 's', 'm']
      }
    }
  },
  'switch'
)

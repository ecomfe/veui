import 'veui-theme-one-icons/spinner'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      loading: 'spinner'
    },
    ui: {
      style: {
        values: ['translucent', 'primary', 'strong', 'text', 'pure']
      },
      size: {
        values: ['xs', 's', 'm', 'l', 'xl']
      },
      role: {
        values: ['icon']
      }
    }
  },
  'button'
)

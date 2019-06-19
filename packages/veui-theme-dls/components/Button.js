import 'veui-theme-one-icons/spinner'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      loading: 'spinner'
    },
    ui: {
      style: {
        values: ['translucent', 'primary', 'strong']
      },
      role: {
        values: ['text', 'icon']
      },
      size: {
        values: ['xs', 's', 'm', 'l', 'xl']
      },
      shape: {
        values: ['pure']
      }
    }
  },
  'button'
)

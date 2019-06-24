import 'veui-theme-one-icons/spinner'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      loading: 'spinner'
    },
    ui: {
      style: {
        values: ['translucent', 'primary', 'strong', 'text', 'icon']
      },
      size: {
        values: ['xs', 's', 'm', 'l', 'xl']
      }
    }
  },
  'button'
)

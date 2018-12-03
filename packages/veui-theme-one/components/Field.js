import 'veui-theme-one-icons/exclamation-circle'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    alert: 'exclamation-circle'
  },
  ui: {
    size: {
      values: ['large', 'small', 'tiny', 'micro'],
      inherit: true
    }
  }
}, 'field')

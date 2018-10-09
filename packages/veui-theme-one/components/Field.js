import '../icons/exclamation-circle-o'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    alert: 'exclamation-circle-o'
  },
  ui: {
    size: {
      values: ['large', 'small', 'tiny', 'micro'],
      inherit: true
    }
  }
}, 'field')

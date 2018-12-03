import 'veui-theme-one-icons/times'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    remove: 'times'
  },
  ui: {
    size: {
      values: ['large', 'small', 'tiny', 'micro'],
      inherit: true
    }
  }
}, 'input')

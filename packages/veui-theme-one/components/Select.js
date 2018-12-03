import 'veui-theme-one-icons/chevron-down'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    expand: 'chevron-down',
    collapse: 'chevron-down'
  },
  ui: {
    size: {
      values: ['large', 'small', 'tiny', 'micro'],
      inherit: true
    },
    style: {
      values: ['alt']
    }
  }
}, 'select')

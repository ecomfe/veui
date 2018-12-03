import 'veui-theme-one-icons/chevron-down'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    expand: 'chevron-down',
    collapse: 'chevron-down'
  },
  ui: {
    style: {
      values: ['primary'],
      inherit: true
    },
    role: {
      values: ['link'],
      inherit: true
    }
  }
}, 'dropdown')

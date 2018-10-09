import '../icons/angle-up-small'
import '../icons/angle-down-small'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    expand: 'angle-down-small',
    collapse: 'angle-up-small'
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

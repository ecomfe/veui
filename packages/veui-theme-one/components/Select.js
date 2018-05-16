import '../icons/angle-up-small'
import '../icons/angle-down-small'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    expand: 'angle-down-small',
    collapse: 'angle-up-small'
  },
  ui: {
    size: {
      values: ['large', 'small', 'tiny', 'micro']
    },
    style: {
      values: ['alt']
    }
  }
}, 'select')

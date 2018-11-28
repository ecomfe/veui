import config from 'veui/managers/config'
import '../icons/angle-right'

config.defaults({
  icons: {
    expand: 'angle-right',
    collapse: 'angle-right'
  },
  ui: {
    slim: {
      boolean: true
    },
    alt: {
      boolean: true
    },
    bordered: {
      boolean: true
    }
  }
}, 'table')

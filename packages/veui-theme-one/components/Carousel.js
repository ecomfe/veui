import '../icons/angle-left'
import '../icons/angle-right'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    prev: 'angle-left',
    next: 'angle-right'
  },
  ui: {
    style: {
      values: ['loose']
    },
    size: {
      values: ['large', 'small']
    }
  }
}, 'carousel')

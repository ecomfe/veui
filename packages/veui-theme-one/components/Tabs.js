import '../icons/cross'
import '../icons/plus-circle-o'
import '../icons/angle-left'
import '../icons/angle-right'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    remove: 'cross',
    add: 'plus-circle-o',
    prev: 'angle-left',
    next: 'angle-right'
  },
  ui: {
    size: {
      values: ['large', 'small', 'tiny']
    }
  }
}, 'tabs')

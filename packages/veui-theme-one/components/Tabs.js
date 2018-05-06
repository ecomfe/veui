import '../icons/cross'
import '../icons/plus-circle-o'
import '../icons/angle-left'
import '../icons/angle-right'
import '../icons/plus-huge'
import '../icons/check-circle-o'
import '../icons/exclamation-circle-o'
import '../icons/info-circle-o'
import '../icons/cross-circle-o'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    remove: 'cross',
    add: 'plus-circle-o',
    prev: 'angle-left',
    next: 'angle-right',
    success: 'check-circle-o',
    warning: 'exclamation-circle-o',
    info: 'info-circle-o',
    error: 'cross-circle-o'
  },
  ui: {
    size: {
      values: ['large', 'small', 'tiny']
    },
    style: {
      values: ['block'],
      data: {
        block: {
          icons: {
            add: 'plus-huge'
          }
        }
      }
    }
  }
}, 'tabs')

import '../icons/check-circle'
import '../icons/exclamation-circle'
import '../icons/info-circle'
import '../icons/cross-circle'
import '../icons/angle-left'
import '../icons/angle-right'
import '../icons/cross'
import config from 'veui/managers/config'

config.defaults({
  'alert.icons': {
    success: 'check-circle',
    warning: 'exclamation-circle',
    info: 'info-circle',
    error: 'cross-circle',
    prev: 'angle-left',
    next: 'angle-right',
    close: 'cross'
  }
})

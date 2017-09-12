import '../icons/check-circle'
import '../icons/exclamation-circle'
import '../icons/info-circle'
import '../icons/cross-circle'
import config from 'veui/managers/config'

config.defaults({
  'toast.icons': {
    success: 'check-circle',
    warning: 'exclamation-circle',
    info: 'info-circle',
    error: 'cross-circle'
  }
})

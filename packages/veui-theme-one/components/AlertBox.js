import '../icons/check-circle-o-large'
import '../icons/info-circle-o-large'
import '../icons/cross-circle-o-large'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    success: 'check-circle-o-large',
    info: 'info-circle-o-large',
    error: 'cross-circle-o-large'
  }
}, 'alertbox')

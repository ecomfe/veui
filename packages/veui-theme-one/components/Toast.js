import 'veui-theme-one-icons/check-circle'
import 'veui-theme-one-icons/exclamation-circle'
import 'veui-theme-one-icons/info-circle'
import 'veui-theme-one-icons/times-circle'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    success: 'check-circle',
    warning: 'exclamation-circle',
    info: 'info-circle',
    error: 'times-circle'
  }
}, 'toast')

import 'veui-theme-one-icons/check-circle'
import 'veui-theme-one-icons/info-circle'
import 'veui-theme-one-icons/times-circle'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    success: 'check-circle',
    info: 'info-circle',
    error: 'times-circle'
  }
}, 'alertbox')

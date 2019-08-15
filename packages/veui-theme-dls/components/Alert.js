import 'veui-theme-one-icons/check-circle'
import 'veui-theme-one-icons/exclamation-circle'
import 'veui-theme-one-icons/info-circle'
import 'veui-theme-one-icons/times-circle'
import 'veui-theme-one-icons/chevron-left'
import 'veui-theme-one-icons/chevron-right'
import 'veui-theme-one-icons/times'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      success: 'check-circle',
      warning: 'exclamation-circle',
      info: 'info-circle',
      error: 'times-circle',
      prev: 'chevron-left',
      next: 'chevron-right',
      close: 'times'
    },
    parts: {
      prev: 'icon',
      next: 'icon',
      close: 'icon'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 's'
      }
    }
  },
  'alert'
)

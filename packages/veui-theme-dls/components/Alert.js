import 'veui-theme-dls-icons/check-circle'
import 'veui-theme-dls-icons/exclamation-circle'
import 'veui-theme-dls-icons/info-circle'
import 'veui-theme-dls-icons/times-circle'
import 'veui-theme-dls-icons/chevron-left'
import 'veui-theme-dls-icons/chevron-right'
import 'veui-theme-dls-icons/times'
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
        default: 'm'
      },
      style: {
        values: ['strong']
      }
    }
  },
  'alert'
)

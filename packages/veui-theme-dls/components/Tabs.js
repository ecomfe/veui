import 'veui-theme-one-icons/times'
import 'veui-theme-one-icons/plus-circle'
import 'veui-theme-one-icons/chevron-left'
import 'veui-theme-one-icons/chevron-right'
import 'veui-theme-one-icons/plus'
import 'veui-theme-one-icons/check-circle'
import 'veui-theme-one-icons/exclamation-circle'
import 'veui-theme-one-icons/info-circle'
import 'veui-theme-one-icons/times-circle'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      remove: 'times',
      add: 'plus-circle',
      prev: 'chevron-left',
      next: 'chevron-right',
      success: 'check-circle',
      warning: 'exclamation-circle',
      info: 'info-circle',
      error: 'times-circle'
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
              add: 'plus'
            }
          }
        }
      }
    }
  },
  'tabs'
)

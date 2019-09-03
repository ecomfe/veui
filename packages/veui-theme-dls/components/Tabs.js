import 'veui-theme-dls-icons/times'
import 'veui-theme-one-icons/plus-circle'
import 'veui-theme-dls-icons/chevron-left'
import 'veui-theme-dls-icons/chevron-right'
import 'veui-theme-dls-icons/plus'
import 'veui-theme-dls-icons/check-circle'
import 'veui-theme-dls-icons/exclamation-circle'
import 'veui-theme-dls-icons/info-circle'
import 'veui-theme-dls-icons/times-circle'
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

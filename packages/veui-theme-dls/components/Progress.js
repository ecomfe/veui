import 'veui-theme-dls-icons/check'
import 'veui-theme-dls-icons/times'
import 'veui-theme-dls-icons/check-circle'
import 'veui-theme-dls-icons/times-circle'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      success: 'check',
      error: 'times',
      successBar: 'check-circle',
      errorBar: 'times-circle'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        data: {
          m: {
            radius: 54,
            strokeWidth: 8,
            strokeLinecap: 'round'
          },
          s: {
            radius: 54,
            strokeWidth: 4,
            strokeLinecap: 'round'
          }
        },
        inherit: true
      }
    }
  },
  'progress'
)

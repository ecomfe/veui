import 'veui-theme-dls-icons/chevron-up'
import 'veui-theme-dls-icons/chevron-down'
import 'veui-theme-dls-icons/plus'
import 'veui-theme-dls-icons/minus'
import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      size: {
        values: ['xs', 's', 'm'],
        inherit: true
      },
      style: {
        values: ['normal', 'strong'],
        default: 'normal',
        data: {
          normal: {
            icons: {
              increase: 'chevron-up',
              decrease: 'chevron-down'
            }
          },
          strong: {
            icons: {
              increase: 'plus',
              decrease: 'minus'
            }
          }
        }
      }
    },
    parts: {
      spinner: ''
    }
  },
  'numberinput'
)

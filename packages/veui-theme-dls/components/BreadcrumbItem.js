import 'veui-theme-dls-icons/chevron-right'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      separator: 'chevron-right'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true,
        default: 'm'
      },
      style: {
        values: ['normal', 'strong'],
        inherit: true
      }
    }
  },
  'breadcrumbitem'
)

import 'veui-theme-dls-icons/chevron-right'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      separator: 'chevron-right'
    },
    ui: {
      style: {
        values: ['normal', 'strong'],
        inherit: true
      }
    }
  },
  'breadcrumbitem'
)

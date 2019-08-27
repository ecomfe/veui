import 'veui-theme-one-icons/chevron-right'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expandable: 'chevron-right'
    },
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true
      }
    }
  },
  'optiongroup'
)

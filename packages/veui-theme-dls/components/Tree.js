import 'veui-theme-dls-icons/chevron-right'
import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      size: {
        values: ['m', 's'],
        inherit: true
      },
      'checkbox-after': {
        boolean: true
      }
    },
    icons: {
      collapse: 'chevron-right',
      expand: 'chevron-right'
    }
  },
  'tree'
)

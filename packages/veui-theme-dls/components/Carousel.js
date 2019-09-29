import 'veui-theme-dls-icons/chevron-left'
import 'veui-theme-dls-icons/chevron-right'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      prev: 'chevron-left',
      next: 'chevron-right'
    },
    ui: {
      style: {
        values: ['loose']
      },
      size: {
        values: ['large', 'small']
      }
    }
  },
  'carousel'
)

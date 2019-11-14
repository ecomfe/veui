import 'veui-theme-dls-icons/chevron-left'
import 'veui-theme-dls-icons/chevron-right'
import 'veui-theme-dls-icons/chevron-double-left'
import 'veui-theme-dls-icons/chevron-double-right'
import 'veui-theme-dls-icons/ellipsis'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      prev: 'chevron-left',
      next: 'chevron-right',
      backward: 'chevron-double-left',
      forward: 'chevron-double-right',
      more: 'ellipsis'
    },
    ui: {
      size: {
        values: ['xs', 's', 'm'],
        inherit: true
      }
    }
  },
  'pagination'
)

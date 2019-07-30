import 'veui-theme-one-icons/chevron-left'
import 'veui-theme-one-icons/chevron-right'
import 'veui-theme-one-icons/angle-double-left'
import 'veui-theme-one-icons/angle-double-right'
import 'veui-theme-one-icons/ellipsis-h'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      prev: 'chevron-left',
      next: 'chevron-right',
      backward: 'angle-double-left',
      forward: 'angle-double-right',
      more: 'ellipsis-h'
    },
    ui: {
      style: {
        values: ['xs', 's', 'm'],
        inherit: true
      }
    }
  },
  'pagination'
)

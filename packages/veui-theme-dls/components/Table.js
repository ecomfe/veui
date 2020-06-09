import 'veui-theme-dls-icons/chevron-double-down'
import 'veui-theme-dls-icons/chevron-down'
import 'veui-theme-dls-icons/arrow-down'
import 'veui-theme-dls-icons/sort'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expand: 'chevron-down',
      collapse: 'chevron-down',
      expandAll: 'chevron-double-down',
      collapseAll: 'chevron-double-down',
      asc: 'arrow-down',
      desc: 'arrow-down',
      sort: 'sort'
    },
    ui: {
      size: {
        values: ['m', 's'],
        inherit: true,
        default: 'm'
      },
      density: {
        values: ['compact', 'normal', 'loose']
      }
    },
    parts: {
      icon: 'text'
    }
  },
  'table'
)

import {
  IconChevronDown,
  IconChevronDoubleDown,
  IconSortAsc,
  IconSortDesc,
  IconSort,
  IconFilterSolid
} from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expand: IconChevronDown,
      collapse: IconChevronDown,
      expandAll: IconChevronDoubleDown,
      collapseAll: IconChevronDoubleDown,
      asc: IconSortAsc,
      desc: IconSortDesc,
      sort: IconSort,
      filter: IconFilterSolid
    },
    ui: {
      size: {
        values: ['m', 's'],
        inherit: true,
        default: 'm'
      },
      density: {
        values: ['compact', 'normal', 'loose']
      },
      crowded: {
        boolean: true
      }
    },
    parts: {
      icon: 'icon',
      loading: 'm strong overlay'
    }
  },
  'table'
)

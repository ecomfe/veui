import {
  IconChevronDown,
  IconChevronDoubleDown,
  IconSortAsc,
  IconSortDesc,
  IconSort
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
      sort: IconSort
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
      icon: 'icon aux'
    }
  },
  'table'
)

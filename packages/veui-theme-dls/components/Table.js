import {
  IconChevronDown,
  IconChevronDoubleDown,
  IconSortAsc,
  IconSortDesc,
  IconSort,
  IconFilterSolid
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
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
      }
    },
    parts: {
      icon: 'icon',
      loading: 'm strong overlay'
    }
  },
  'table'
)

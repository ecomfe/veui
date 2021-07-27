import {
  IconChevronRight,
  IconChevronLeft,
  IconChevronDown,
  IconChevronDoubleRight,
  IconChevronDoubleLeft
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      prev: IconChevronLeft,
      next: IconChevronRight,
      backward: IconChevronDoubleLeft,
      forward: IconChevronDoubleRight,
      expand: IconChevronDown
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    },
    parts: {
      nav: 'icon aux',
      toggle: 'text'
    }
  },
  'calendar'
)

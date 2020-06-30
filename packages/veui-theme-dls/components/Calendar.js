import {
  IconChevronRight,
  IconChevronLeft,
  IconChevronDown,
  IconChevronDoubleRight,
  IconChevronDoubleLeft
} from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
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
      nav: 'icon',
      toggle: 'text'
    }
  },
  'calendar'
)

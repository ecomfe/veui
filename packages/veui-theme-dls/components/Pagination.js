import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronDoubleLeft,
  IconChevronDoubleRight,
  IconEllipsis
} from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      prev: IconChevronLeft,
      next: IconChevronRight,
      backward: IconChevronDoubleLeft,
      forward: IconChevronDoubleRight,
      more: IconEllipsis
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

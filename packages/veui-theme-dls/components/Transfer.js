import {
  IconCheck,
  IconTimes,
  IconChevronRight,
  IconTriangleRight
} from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      checked: IconCheck,
      select: null,
      remove: IconTimes,
      collapse: IconTriangleRight,
      expand: IconTriangleRight,
      separator: IconChevronRight
    },
    parts: {
      tree: 'checkbox-after',
      remove: 'icon',
      selectAll: 'strong text',
      removeAll: 'strong text'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    }
  },
  'transfer'
)

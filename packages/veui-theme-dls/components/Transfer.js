import {
  IconCheck,
  IconTimes,
  IconChevronRight,
  IconCaretRight
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      checked: IconCheck,
      select: null,
      remove: IconTimes,
      collapse: IconCaretRight,
      expand: IconCaretRight,
      separator: IconChevronRight
    },
    parts: {
      tree: 'checkbox-after',
      remove: 'icon aux',
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

import { IconCaretRight } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      size: {
        values: ['m', 's'],
        inherit: true
      },
      'checkbox-after': {
        boolean: true
      }
    },
    icons: {
      collapse: IconCaretRight,
      expand: IconCaretRight
    }
  },
  'tree'
)

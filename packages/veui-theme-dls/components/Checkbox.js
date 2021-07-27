import { IconMinus, IconCheck } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      indeterminate: IconMinus,
      checked: IconCheck
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      }
    }
  },
  'checkbox'
)

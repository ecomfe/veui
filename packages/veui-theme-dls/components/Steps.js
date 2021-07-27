import { IconCheck, IconTimes } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      success: IconCheck,
      error: IconTimes
    },
    ui: {
      direction: {
        values: ['vertical', 'label-vertical']
      },
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    }
  },
  'steps'
)

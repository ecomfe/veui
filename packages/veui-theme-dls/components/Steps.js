import { IconCheck, IconTimes } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
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

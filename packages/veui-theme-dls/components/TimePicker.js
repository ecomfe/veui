import { IconClock, IconTimesCircle } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      clock: IconClock,
      clear: IconTimesCircle
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    },
    parts: {
      clear: 'icon'
    }
  },
  'timepicker'
)

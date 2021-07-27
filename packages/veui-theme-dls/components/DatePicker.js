import { IconCalendar, IconTimesCircle } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      calendar: IconCalendar,
      clear: IconTimesCircle
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    },
    parts: {
      clear: 'icon aux',
      input: 'inline'
    }
  },
  'datepicker'
)

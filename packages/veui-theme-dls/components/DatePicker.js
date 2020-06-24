import 'veui-theme-dls-icons/calendar'
import 'veui-theme-dls-icons/times-circle'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      calendar: 'calendar',
      clear: 'times-circle'
    },
    ui: {
      style: {
        values: ['alt'],
        inherit: true
      },
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    },
    parts: {
      clear: 'text aux',
      input: 'inline'
    }
  },
  'datepicker'
)

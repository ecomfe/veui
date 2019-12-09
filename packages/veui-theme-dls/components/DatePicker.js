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
        values: ['large', 'small', 'tiny', 'micro'],
        inherit: true
      }
    },
    parts: {
      clear: 'icon'
    }
  },
  'datepicker'
)

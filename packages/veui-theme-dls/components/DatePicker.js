import 'veui-theme-dls-icons/calendar'
import 'veui-theme-dls-icons/times'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      calendar: 'calendar',
      clear: 'times'
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
    }
  },
  'datepicker'
)

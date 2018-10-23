import '../icons/calendar'
import '../icons/cross'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    calendar: 'calendar',
    clear: 'cross'
  },
  ui: {
    style: {
      values: ['alt']
    },
    size: {
      values: ['large', 'small', 'tiny', 'micro'],
      inherit: true
    }
  }
}, 'datepicker')

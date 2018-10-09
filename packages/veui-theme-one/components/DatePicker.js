import '../icons/calendar'
import '../icons/cross'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    calendar: 'calendar',
    clear: 'cross'
  },
  placeholder: '开始选择时间',
  rangePlaceholder: '开始选择时间段',
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

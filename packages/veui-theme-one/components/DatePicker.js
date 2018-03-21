import '../icons/calendar'
import '../icons/cross'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    calendar: 'calendar',
    clear: 'cross'
  },
  placeholder: '选择时间',
  placeholderBegin: '开始选择时间段',
  placeholderEnd: '',
  ui: {
    style: {
      values: ['alt']
    },
    size: {
      values: ['large', 'small', 'tiny', 'micro']
    }
  }
}, 'datepicker')

import '../icons/calendar'
import '../icons/cross-circle-o'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    calendar: 'calendar',
    clear: 'cross-circle-o'
  },
  placeholder: '选择时间',
  placeholderBegin: '开始选择时间段',
  placeholderEnd: ''
}, 'datepicker')

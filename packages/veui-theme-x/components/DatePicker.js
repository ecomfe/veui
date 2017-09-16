import '../icons/calendar'
import '../icons/cross-small'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    calendar: 'calendar',
    clear: 'cross-small'
  },
  placeholder: '选择时间',
  placeholderBegin: '开始选择时间段',
  placeholderEnd: ''
}, 'datepicker')

import i18n from '../../managers/i18n'

i18n.register(
  'en-US',
  {
    calendar: 'Calendar',
    selectYear: 'Select year, currently {year}',
    selectMonth: 'Select month, currently {month}',
    year: '{year}',
    month: null,
    date: '{date}',
    monthsShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    monthsLong: [
      'January',
      'Feburary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    daysLong: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    prevMonth: 'Previous month',
    prevYear: 'Previous year',
    prevDecade: 'Previous decade',
    nextMonth: 'Next month',
    nextYear: 'Next year',
    nextDecade: 'Next decade',
    dateLabel: '{day}, {month} {date}, {year}'
  },
  {
    ns: 'calendar'
  }
)

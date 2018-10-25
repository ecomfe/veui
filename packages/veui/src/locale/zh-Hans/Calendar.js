import i18n from '../../managers/i18n'

i18n.register(
  'zh-Hans',
  {
    calendar: '日历',
    selectYear: `选择年份，现在是 {year} 年`,
    selectMonth: `选择月份，现在是 {month} 月`,
    year: '{year} 年',
    month: '{month} 月',
    date: '{date} 日',
    monthsShort: null,
    monthsLong: null,
    daysShort: ['一', '二', '三', '四', '五', '六', '日'],
    daysLong: [
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
      '星期日'
    ],
    prevMonth: '上个月',
    prevYear: '上一年',
    prevDecade: '上十年',
    nextMonth: '下个月',
    nextYear: '下一年',
    nextDecade: '下十年',
    dateLabel: '{year} {month} {date}，{day}'
  },
  {
    ns: 'calendar'
  }
)

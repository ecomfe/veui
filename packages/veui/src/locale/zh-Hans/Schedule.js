import i18n from '../../managers/i18n'

i18n.register(
  'zh-Hans',
  {
    preset: '预设时段',
    selectPreset: '选择预设时段',
    selectedRanges: '已选时段',
    availableRanges: '可选时段',
    selected: '已选择',
    available: '可选择',
    hourLabel: '{dayName}，{timeRange}，{status}',
    dayLabel: '选择{dayName}全天',
    daysAbbr: ['一', '二', '三', '四', '五', '六', '日'],
    daysLong: [
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
      '星期日'
    ],
    entireDay: '全天'
  },
  {
    ns: 'schedule'
  }
)

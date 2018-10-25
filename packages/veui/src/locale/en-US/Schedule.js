import i18n from '../../managers/i18n'

i18n.register(
  'en-US',
  {
    preset: 'Preset ranges',
    selectPreset: 'Select preset ranges',
    selectedRanges: 'Selected',
    availableRanges: 'Available',
    selected: 'Selected',
    available: 'Available',
    hourLabel: '{timeRange} of {dayName}, {status}',
    dayLabel: 'Select {dayName}',
    daysAbbr: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    daysLong: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    entireDay: 'Entire day'
  },
  {
    ns: 'schedule'
  }
)

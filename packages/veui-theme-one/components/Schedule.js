import config from 'veui/managers/config'

config.defaults({
  'schedule.statuses': [
    { name: 'selected', label: '已选时段' },
    { name: 'available', label: '未选时段' }
  ]
})

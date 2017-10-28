import config from 'veui/managers/config'

config.defaults({
  'schedule.statuses': [
    { slug: 'selected', label: '已选时段' },
    { slug: 'available', label: '未选时段' }
  ]
})

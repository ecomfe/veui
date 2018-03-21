import config from 'veui/managers/config'

config.defaults({
  statuses: [
    { name: 'selected', label: '已选时段' },
    { name: 'available', label: '未选时段' }
  ]
}, 'schedule')

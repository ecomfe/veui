import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      },
      style: {
        values: ['icon'],
        inherit: true
      }
    },
    parts: {
      checked: 'primary'
    }
  },
  'checkbuttongroup'
)

import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      }
    }
  },
  'radio'
)

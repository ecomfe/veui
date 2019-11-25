import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        default: 'm',
        inherit: true
      }
    }
  },
  'inputgroup'
)

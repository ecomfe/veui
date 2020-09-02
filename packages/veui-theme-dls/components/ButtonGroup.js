import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      style: {
        values: ['primary', 'strong', 'basic'],
        inherit: true
      },
      size: {
        values: ['xs', 's', 'm', 'l', 'xl'],
        default: 'm',
        inherit: true
      }
    }
  },
  'buttongroup'
)

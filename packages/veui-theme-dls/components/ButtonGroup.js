import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      style: {
        values: ['primary', 'strong'],
        inherit: true
      },
      size: {
        values: ['xs', 's', 'm', 'l', 'xl'],
        inherit: true
      }
    }
  },
  'buttongroup'
)

import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      style: {
        values: ['alt'],
        inherit: true
      },
      size: {
        values: ['large', 'small', 'tiny', 'micro'],
        inherit: true
      }
    }
  },
  'radiobuttongroup'
)

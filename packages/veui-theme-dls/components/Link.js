import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      style: {
        values: ['normal', 'strong']
      },
      size: {
        values: ['s', 'm'],
        inherit: true,
        default: 'm'
      }
    }
  },
  'link'
)

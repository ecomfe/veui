import config from 'veui/managers/config'

config.defaults(
  {
    parts: {
      search: 'inline'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    }
  },
  'filterpanel'
)

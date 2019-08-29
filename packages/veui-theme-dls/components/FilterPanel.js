import config from 'veui/managers/config'

config.defaults(
  {
    parts: {
      search: 'small'
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

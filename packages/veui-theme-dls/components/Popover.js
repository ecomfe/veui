import config from 'veui/managers/config'

config.defaults(
  {
    parts: {
      self: 'reverse'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm'
      }
    }
  },
  'popover'
)

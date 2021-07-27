import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      }
    },
    parts: {
      button: 'basic'
    }
  },
  'radiobuttongroup'
)

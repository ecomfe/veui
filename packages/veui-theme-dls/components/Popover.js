import ui from 'veui/managers/ui'

ui.defaults(
  {
    parts: {
      self: ''
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

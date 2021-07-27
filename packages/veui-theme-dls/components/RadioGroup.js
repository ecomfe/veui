import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true,
        default: 'm'
      }
    }
  },
  'radiogroup'
)

import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        default: 'm',
        inherit: true
      }
    }
  },
  'autocomplete'
)

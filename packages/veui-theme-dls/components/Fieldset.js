import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      size: {
        values: ['l', 'm', 's', 'xs'],
        inherit: true,
        default: 'm'
      }
    }
  },
  'fieldset'
)

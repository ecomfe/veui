import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      },
      style: {
        values: ['normal', 'simple', 'basic', 'strong'],
        inherit: true
      },
      border: {
        values: ['borderless', 'bordered'],
        inherit: true
      },
      dull: {
        boolean: true,
        inherit: true
      },
      separate: {
        boolean: true
      }
    }
  },
  'accordion'
)

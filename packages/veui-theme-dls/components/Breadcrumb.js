import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true,
        default: 'm'
      },
      style: {
        values: ['normal', 'strong'],
        inherit: true
      }
    }
  },
  'breadcrumb'
)

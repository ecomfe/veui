import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      size: {
        values: ['xs', 's', 'm'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      progress: 'fluid'
    }
  },
  'loadingbar'
)

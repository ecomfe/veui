import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm', 'l'],
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

import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      loading: null
    },
    ui: {
      style: {
        values: ['normal', 'strong', 'reverse']
      },
      size: {
        values: ['s', 'm', 'l'],
        inherit: true,
        default: 'm'
      },
      direction: {
        values: ['vertical']
      }
    }
  },
  'loading'
)

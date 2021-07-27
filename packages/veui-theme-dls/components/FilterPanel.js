import ui from 'veui/managers/ui'

ui.defaults(
  {
    parts: {
      search: 'inline'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    }
  },
  'filterpanel'
)

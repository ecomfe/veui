import ui from 'veui/managers/ui'

ui.defaults(
  {
    ui: {
      style: {
        values: ['normal', 'strong']
      },
      size: {
        values: ['s', 'm'],
        inherit: true,
        default: 'm'
      }
    }
  },
  'link'
)

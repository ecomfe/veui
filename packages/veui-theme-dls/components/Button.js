import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      loading: null
    },
    ui: {
      style: {
        values: [
          'normal',
          'basic',
          'translucent',
          'primary',
          'text',
          'icon',
          'ghost'
        ],
        default: 'normal'
      },
      strength: {
        values: ['strong', 'aux']
      },
      size: {
        values: ['xs', 's', 'm', 'l', 'xl'],
        inherit: true,
        default: 'm'
      },
      shape: {
        values: ['square']
      }
    }
  },
  'button'
)

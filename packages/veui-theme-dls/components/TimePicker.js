import 'veui-theme-one-icons/clock'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      clock: 'clock'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    }
  },
  'timepicker'
)

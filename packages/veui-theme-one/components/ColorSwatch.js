
import config from 'veui/managers/config'

config.defaults({
  ui: {
    size: {
      values: ['small', 'normal'],
      default: 'normal'
    },
    tip: {
      boolean: true,
      default: false
    }
  }
}, 'colorswatch')

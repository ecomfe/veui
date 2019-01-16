
import config from 'veui/managers/config'

config.defaults({
  ui: {
    format: {
      values: ['hex', 'hsl', 'rgb'],
      default: 'rgb'
    },
    size: {
      values: ['small', 'normal'],
      default: 'normal'
    },
    alpha: {
      boolean: true,
      default: false
    },
    switchable: {
      boolean: true,
      default: false
    },
    tip: {
      boolean: true,
      default: false
    }
  }
}, 'colorswatch')

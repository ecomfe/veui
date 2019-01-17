
import config from 'veui/managers/config'

config.defaults({
  shadeFieldSize: {
    normal: [294, 294],
    small: [248, 180]
  },
  ui: {
    format: {
      values: ['hex', 'hsl', 'rgb'],
      default: 'rgb'
    },
    size: {
      values: ['small', 'normal'],
      default: 'normal'
    },
    swatch: {
      boolean: true,
      default: false
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
}, 'colorpicker')

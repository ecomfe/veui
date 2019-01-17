
import config from 'veui/managers/config'

config.defaults({
  shadeFieldSize: {
    normal: [294, 294],
    small: [248, 180]
  },
  ui: {
    size: {
      values: ['small', 'normal'],
      default: 'normal'
    },
    swatch: {
      boolean: true,
      default: false
    },
    tip: {
      boolean: true,
      default: false
    }
  }
}, 'colorpicker')


import config from 'veui/managers/config'

config.defaults({
  ui: {
    size: {
      values: ['small'],
      data: {
        default: {
          shadeFieldSize: [294, 294]
        },
        small: {
          shadeFieldSize: [248, 180]
        }
      }
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

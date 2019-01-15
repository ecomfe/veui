
import config from 'veui/managers/config'

let ui = {
  format: {
    values: ['hex', 'hsl', 'rgb']
  },
  size: {
    values: ['large', 'small', 'normal']
  },
  channel: {
    values: ['alpha']
  }
}

config.defaults({ui}, 'colorswatch')

import '../icons/angle-up'
import '../icons/angle-down'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    increase: 'angle-up',
    decrease: 'angle-down'
  },
  ui: {
    size: {
      values: ['large', 'small', 'tiny', 'micro']
    }
  }
}, 'numberinput')

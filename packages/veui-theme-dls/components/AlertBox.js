import 'veui-theme-dls-icons/check-circle'
import 'veui-theme-dls-icons/info-circle'
import 'veui-theme-dls-icons/exclamation-circle'
import 'veui-theme-dls-icons/times-circle'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      success: 'check-circle',
      info: 'info-circle',
      error: 'times-circle',
      warning: 'exclamation-circle'
    },
    parts: {
      ok: 'primary'
    }
  },
  'alertbox'
)

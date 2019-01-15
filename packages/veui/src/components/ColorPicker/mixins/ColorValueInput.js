
import ColorUpdater from './ColorUpdater'
import Input from '../../Input'
import {nudge as numeric} from '../../../directives'

export default {
  components: {
    'veui-input': Input
  },
  mixins: [
    ColorUpdater
  ],
  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    numeric
  }
}

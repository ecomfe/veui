import { intersection } from 'lodash'
import { outside } from '../directives'
import { config } from '../managers'
import { ui } from '../mixins'
import '../styles/theme-default/dropdown.less'

config.defaults({
  'dropdown.buttonUI': 'aux'
})

export default {
  mixins: [ui],
  directives: { outside },
  data () {
    return {
      expanded: false
    }
  },
  computed: {
    buttonUI () {
      let defaultUI = config.get('dropdown.buttonUI')
      if (!intersection(this.uiProps, ['primary', 'aux', 'alt', 'link']).length) {
        return [...this.uiProps, defaultUI].join(' ')
      }
      return this.ui
    }
  },
  methods: {
    close () {
      this.expanded = false
    }
  }
}

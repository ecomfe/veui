import { includes } from 'lodash'
import { outside } from '../directives'
import { config } from '../managers'
import { ui } from '../mixins'

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
      let props = this.uiProps.filter(prop => {
        return includes(['alt', 'tiny', 'small', 'large'], prop)
      })
      if (!includes(props, 'alt')) {
        props.push(config.get('dropdown.buttonUI'))
      }
      return props.join(' ')
    }
  },
  methods: {
    close () {
      this.expanded = false
    }
  }
}

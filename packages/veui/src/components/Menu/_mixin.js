import Icon from '../Icon'
import Link from '../Link'
import Overlay from '../Overlay'
import OptionGroup from '../OptionGroup'
import overlay from '../../mixins/overlay'
import ui from '../../mixins/ui'
import prefix from '../../mixins/prefix'
import controllable from '../../mixins/controllable'
import outside from '../../directives/outside'
import { find } from '../../utils/datasource'
import { map, endsWith, pick, isString } from 'lodash'

const ensureSlash = str => (endsWith(str, '/') ? str : `${str}/`)

export default {
  name: 'veui-nav',
  components: {
    'veui-link': Link,
    'veui-icon': Icon,
    'veui-overlay': Overlay,
    'veui-option-group': OptionGroup
  },
  uiTypes: ['select'],
  directives: { outside },
  props: {
    active: String,
    items: {
      type: Array,
      default () {
        return []
      }
    },
    matches: {
      type: Function,
      default (route, item) {
        return ensureSlash(route.path) === ensureSlash(item.path)
      }
    }
  },
  computed: {
    normalizedItems () {
      return this.normalizeItems(this.items)
    },
    exactAndActiveItems () {
      return this.findActiveItems(this.normalizedItems)
    },
    exactActiveItem () {
      return this.exactAndActiveItems ? this.exactAndActiveItems[0] : null
    },
    activeItems () {
      return this.exactAndActiveItems ? this.exactAndActiveItems.slice(1) : []
    }
  },
  mixins: [prefix, overlay, ui, controllable(['active'])],
  created () {
    if (this.$router) {
      const updateActive = route => {
        let exactActiveItem = find(this.normalizedItems, item =>
          this.matches(route, item)
        )
        this.realActive = exactActiveItem ? exactActiveItem.name : null
      }
      this.$watch('$route', updateActive)
      // active 受控了，初始当前路由就不同步了
      if (!this.isControlled('active')) {
        updateActive(this.$route)
      }
    }
  },
  methods: {
    normalizeItems (items) {
      return map(items, item => {
        let { to, name, children } = item
        if (name == null && to == null) {
          throw new Error(
            '[veui-menu] `name` or `to` of menu item is required!'
          )
        }

        item = { ...item }

        if (to == null) {
          item.path = null
        } else if (this.$router) {
          let { path } = this.$router.resolve(to).route
          item.path = path
        } else if (isString(to)) {
          item.path = to
        } else {
          throw new Error(
            '[veui-menu] Non-string `to` cannot be resolved without Vue Router.'
          )
        }

        if (!name) {
          item.name = item.path || ''
        }
        item.value = item.value || item.name

        if (children) {
          item.children = this.normalizeItems(children)
        }

        return typeof this.postNormalize === 'function'
          ? this.postNormalize(item)
          : item
      })
    },
    findActiveItems (items) {
      let result = []
      items.some(item => {
        let exactActive = this.realActive === item.name
        if (exactActive) {
          result.push(item)
          return true
        }
        if (item.children) {
          let children = this.findActiveItems(item.children)
          if (children) {
            result = [...children, item]
            return true
          }
        }
        return false
      })
      return result.length ? result : null
    },
    pickLinkProps (data) {
      return pick(data, Object.keys(Link.props))
    },
    activateItem (nameOrItem, closePopout) {
      let item =
        typeof nameOrItem === 'string'
          ? find(this.normalizedItems, item => item.name === nameOrItem)
          : nameOrItem
      let { to, disabled, name } = item
      if (disabled) return
      if (to) {
        this.realActive = name
        this.$emit('activate', item)
        if (closePopout && typeof this.close === 'function') {
          this.close()
        }
      }
    },
    handleSelect (nameOrItem) {
      return this.activateItem(nameOrItem, true)
    },
    handleGroupLabelClick (group, closeMenu) {
      this.activateItem(group, true)
      if (group.to) {
        closeMenu()
      }
      this.$emit('click', group)
    }
  }
}

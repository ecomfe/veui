<script>
import { uniqueId, includes } from 'lodash'
import { useCoupledChild, mapState } from '../../mixins/coupled'
import '../../common/uiTypes'
import prefix from '../../mixins/prefix'
import { renderSlot, Void } from '../../utils/helper'

let tabFields = {
  name: ({ id, name }) => name || id,
  id: 'id',
  label: 'label',
  disabled: 'disabled',
  realTo: 'to',
  native: 'native',
  removable: 'removable',
  status: 'status',
  isMatched: 'matched',
  realMatches: 'matches',
  attrs: ({ $attrs }) => $attrs,
  renderTab: vm => props => renderSlot(vm, 'item', props),
  renderLabel: vm => props => renderSlot(vm, 'label', props),
  renderPanel: vm => props => renderSlot(vm, 'default', props)
}

let tab = useCoupledChild({
  direct: true,
  type: 'tab',
  parentType: 'tabs',
  fields: tabFields,
  watchKeys: [
    'label',
    'disabled',
    'to',
    'native',
    'removable',
    'status',
    'matched',
    'matches'
  ]
})

const STATUS_LIST = ['success', 'warning', 'info', 'error']

export default {
  name: 'veui-tab',
  mixins: [prefix, tab],
  props: {
    label: String,
    name: String,
    disabled: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object],
      default: ''
    },
    matches: Function,
    native: Boolean,
    removable: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: null,
      validator (val) {
        return includes(STATUS_LIST, val)
      }
    }
  },
  data () {
    return {
      id: uniqueId('veui-tab-')
    }
  },
  computed: {
    isActive () {
      let { activeTab } = this.tabs
      if (!activeTab) {
        return false
      }
      return this.id === activeTab.id
    },
    realTo () {
      if (!this.to) {
        return null
      }

      return this.$router && typeof this.to === 'string'
        ? this.$router.resolve(this.to).route
        : this.to
    },
    realMatches () {
      return this.matches || this.tabs.matches || (() => false)
    }
  },
  // updated -> beforeUpdate
  // 因为 updated 在 vue 更新队列之后触发，而 beforeUpdate 中的改动会在本次渲染中更新，nextTick 中就可以观察到这些更新了
  beforeUpdate () {
    let parent = this.tabs
    if (!parent) {
      return
    }

    parent.updateChild({
      id: this.id,
      ...mapState(this, tabFields)
    })
  },
  render () {
    return <Void />
  }
}
</script>

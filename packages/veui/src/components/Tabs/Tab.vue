<script>
import { uniqueId, includes } from 'lodash'
import { makeCoupledChild } from '../../mixins/coupled'
import '../../common/uiTypes'
import prefix from '../../mixins/prefix'
import { renderSlot } from '../../utils/helper'

let tab = makeCoupledChild({
  direct: true,
  type: 'tab',
  parentType: 'tabs',
  fields: {
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
})

const STATUS_LIST = ['success', 'warning', 'info', 'error']

export default {
  name: 'veui-tab',
  mixins: [prefix, tab],
  props: {
    label: {
      type: String,
      required: true
    },
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
  render (h) {
    return h()
  }
}
</script>

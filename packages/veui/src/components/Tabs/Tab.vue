<script>
import { includes } from 'lodash'
import { useChild } from '../../mixins/coupled'
import '../../common/global'
import prefix from '../../mixins/prefix'
import { renderSlot, Void } from '../../utils/helper'

let tab = useChild('tab', 'tabs', [
  ['name', ({ childId, name }) => name || childId],
  ['id', ({ childId }) => childId],
  'label',
  'disabled',
  ['to', 'realTo'],
  'native',
  'removable',
  'status',
  ['matched', 'isMatched'],
  ['matches', 'realMatches'],
  ['attrs', ({ $attrs }) => $attrs],
  ['renderTab', (vm) => (props) => renderSlot(vm, 'item', props)],
  ['renderLabel', (vm) => (props) => renderSlot(vm, 'label', props)],
  ['renderPanel', (vm) => (props) => renderSlot(vm, 'default', props)]
])

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
  computed: {
    isActive () {
      let { activeTab } = this.tabs
      if (!activeTab) {
        return false
      }
      return this.childId === activeTab.childId
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
      return this.matches || this.tabs.realMatches || (() => false)
    }
  },
  updated () {
    this.tabs.$forceUpdate()
  },
  render () {
    return <Void />
  }
}
</script>

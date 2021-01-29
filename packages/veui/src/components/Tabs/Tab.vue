<script>
import { uniqueId, includes } from 'lodash'
import { useChild } from '../../mixins/coupled'
import '../../common/uiTypes'
import prefix from '../../mixins/prefix'
import { renderSlot, Void } from '../../utils/helper'

let tabFields = [
  ['name', ({ id, name }) => name || id],
  'id',
  'label',
  'disabled',
  ['to', 'realTo'],
  'native',
  'removable',
  'status',
  ['matched', 'isMatched'],
  ['matches', 'realMatches'],
  ['attrs', ({ $attrs }) => $attrs],
  ['renderTab', vm => props => renderSlot(vm, 'item', props)],
  ['renderLabel', vm => props => renderSlot(vm, 'label', props)],
  ['renderPanel', vm => props => renderSlot(vm, 'default', props)]
]

let tab = useChild('tab', 'tabs', tabFields, { direct: true })

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
  updated () {
    let parent = this.tabs
    if (!parent) {
    }

    parent.$forceUpdate()
  },
  render () {
    return <Void />
  }
}
</script>

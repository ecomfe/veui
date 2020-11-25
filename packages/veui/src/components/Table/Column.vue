<script>
import { uniqueId, pick } from 'lodash'
import colgroup from '../../mixins/colgroup'
import { getIndexOfType } from '../../utils/context'
import '../../common/uiTypes'

export default {
  name: 'veui-table-column',
  uiTypes: ['table-column', 'transparent'],
  mixins: [colgroup],
  props: {
    title: String,
    field: String,
    width: [String, Number],
    sortable: Boolean,
    align: {
      type: String,
      validator (val) {
        return val === 'left' || val === 'right' || val === 'center'
      }
    },
    span: Function,
    fixed: {
      type: [Boolean, String],
      validator (val) {
        return typeof val === 'boolean' || val === 'left' || val === 'right'
      }
    },
    allowedOrders: Array,
    desc: String
  },
  data () {
    return {
      id: uniqueId('veui-table-column-')
    }
  },
  computed: {
    realFixed () {
      if (this.colgroup.realFixed) {
        return this.colgroup.realFixed
      }
      if (this.fixed === true || this.fixed === 'left') {
        return 'left'
      }
      if (this.fixed === 'right') {
        return 'right'
      }
      return false
    }
  },
  created () {
    const index = getIndexOfType(this, 'colgroup')

    const props = [
      'title',
      'field',
      'width',
      'sortable',
      'align',
      'span',
      'allowedOrders',
      'desc'
    ]

    const renderBody = item => {
      const defaultRow = this.$scopedSlots.default
      if (defaultRow) {
        return defaultRow(item)
      }
      return item[this.field]
    }

    this.colgroup.addColumn({
      ...pick(this, ...props, 'id'),
      fixed: this.realFixed,
      index,
      columns: this.columns,
      hasFoot: () => {
        return !!(this.$scopedSlots.foot || this.$slots.foot)
      },
      renderBody,
      renderSubRow: item => {
        const expandRow = this.$scopedSlots['sub-row']
        if (expandRow) {
          return expandRow(item)
        }
        return renderBody(item)
      },
      renderHead: () => {
        const render =
          this.$scopedSlots.head || (() => this.$slots.head || this.title)
        return render()
      },
      hasStaleHead: () => !!this.$slots.head,
      renderFoot: () => {
        const render =
          this.$scopedSlots.foot || (() => this.$slots.foot || null)
        return render()
      },
      hasStaleFoot: () => !!this.$slots.foot,
      hasPopoverDesc: () => {
        return this.desc !== undefined || this.$slots.desc !== undefined
      },
      renderPopover: () => {
        const render = () => this.$slots.desc || this.desc
        return render()
      }
    })
  },
  destroyed () {
    this.colgroup.removeColumnById(this.id)
  },
  render (h) {
    return h('div', this.$slots.default)
  }
}
</script>

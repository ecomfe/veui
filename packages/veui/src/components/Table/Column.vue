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
    allowedOrders: Array
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
    let index = getIndexOfType(this, 'colgroup')

    const props = ['title', 'field', 'width', 'sortable', 'align', 'span', 'allowedOrders']

    let renderBody = item => {
      let defaultRow = this.$scopedSlots.default
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
        let expandRow = this.$scopedSlots['sub-row']
        if (expandRow) {
          return expandRow(item)
        }
        return renderBody(item)
      },
      renderHead: () => {
        let render =
          this.$scopedSlots.head || (() => this.$slots.head || this.title)
        return render()
      },
      hasStaleHead: () => !!this.$slots.head,
      renderFoot: () => {
        let render = this.$scopedSlots.foot || (() => this.$slots.foot || null)
        return render()
      },
      hasStaleFoot: () => !!this.$slots.foot
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

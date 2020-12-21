<script>
import { useCoupledChild } from '../../mixins/coupled'
import colgroup from '../../mixins/colgroup'
import { renderSlot } from '../../utils/helper'
import '../../common/uiTypes'

let renderBody = vm => item => renderSlot(vm, 'default', item) || item[vm.field]

let col = useCoupledChild({
  type: 'table-column',
  parentType: 'colgroup',
  fields: {
    title: 'title',
    field: 'field',
    width: 'width',
    sortable: 'sortable',
    align: 'align',
    span: 'span',
    allowedOrders: 'allowedOrders',
    desc: 'desc',
    filterValue: 'filterValue',
    columns: 'columns',
    realFixed: 'fixed',
    hasFoot: vm => () => !!(vm.$scopedSlots.foot || vm.$slots.foot),
    renderBody,
    renderSubRow: vm => item =>
      renderSlot(vm, 'sub-row', item) || renderBody(vm)(item),
    renderHead: vm => () => renderSlot(vm, 'head') || vm.title,
    renderFoot: vm => () => renderSlot(vm, 'foot'),
    renderDesc: vm => props => renderSlot(vm, 'desc', props) || vm.desc,
    renderFilter: vm => props => renderSlot(vm, 'filter', props),
    hasFilter: vm => () => !!(vm.$scopedSlots.filter || vm.$slots.filter),
    hasStaleHead: vm => () => !!(vm.$slots.head || vm.$slots.desc),
    hasStaleFoot: vm => () => !!vm.$slots.foot
  },
  watchKeys: [
    'title',
    'field',
    'width',
    'sortable',
    'align',
    'span',
    'allowedOrders',
    'desc',
    'filterValue'
  ]
})

export default {
  name: 'veui-table-column',
  uiTypes: ['transparent'],
  mixins: [col, colgroup],
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
    desc: String,
    // eslint-disable-next-line vue/require-prop-types
    filterValue: {}
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
  render (h) {
    return h('div', this.$slots.default)
  }
}
</script>

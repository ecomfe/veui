<script>
import { useChild } from '../../mixins/coupled'
import useControllable from '../../mixins/controllable'
import colgroup from '../../mixins/colgroup'
import { renderSlot } from '../../utils/helper'
import '../../common/uiTypes'

let renderBody = vm => item => renderSlot(vm, 'default', item) || item[vm.field]

let col = useChild('table-column', 'colgroup', [
  'title',
  'field',
  'width',
  'sortable',
  'align',
  'span',
  'allowedOrders',
  'desc',
  ['filterValue', 'realFilterValue'],
  'filterTitle',
  ['filterOptions', 'realFilterOptions'],
  'filterMultiple',
  'columns',
  ['fixed', 'realFixed'],
  ['hasFoot', vm => () => !!(vm.$scopedSlots.foot || vm.$slots.foot)],
  ['renderBody', renderBody],
  [
    'renderSubRow',
    vm => item => renderSlot(vm, 'sub-row', item) || renderBody(vm)(item)
  ],
  ['renderHead', vm => () => renderSlot(vm, 'head') || vm.title],
  ['renderFoot', vm => () => renderSlot(vm, 'foot')],
  ['renderDesc', vm => props => renderSlot(vm, 'desc', props) || vm.desc],
  ['renderFilter', vm => props => renderSlot(vm, 'filter', props)],
  [
    'hasFilter',
    vm => () =>
      !!(vm.$scopedSlots.filter || vm.$slots.filter || vm.filterOptions)
  ],
  ['hasFilterSlot', vm => () => !!(vm.$scopedSlots.filter || vm.$slots.filter)],
  ['hasStaleHead', vm => () => !!(vm.$slots.head || vm.$slots.desc)],
  ['hasStaleFoot', vm => () => !!vm.$slots.foot],
  ['handleFilterChange', vm => vm.handleFilterChange]
])

export default {
  name: 'veui-table-column',
  uiTypes: ['transparent'],
  mixins: [
    col,
    colgroup,
    useControllable({
      prop: 'filterValue'
    })
  ],
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
    filterValue: {},
    filterTitle: String,
    filterOptions: Array,
    filterMultiple: Boolean
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
    },
    realFilterOptions () {
      if (this.filterTitle) {
        return [
          {
            label: this.filterTitle,
            options: this.filterOptions
          }
        ]
      }
      return this.filterOptions
    }
  },
  methods: {
    handleFilterChange (val) {
      this.commit('filterValue', val)
      if (val !== this.filterValue) {
        this.$emit('filterchange', val)
      }
    }
  },
  render (h) {
    return h('div', this.$slots.default)
  }
}
</script>

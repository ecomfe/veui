<script>
import { uniqueId, pick } from 'lodash'
import table from '../../mixins/table'
import { getIndexOfType } from '../../utils/context'
import '../../config/uiTypes'

export default {
  name: 'veui-table-column',
  uiTypes: ['table-column'],
  mixins: [table],
  props: {
    title: String,
    field: {
      type: String,
      required: true
    },
    width: [String, Number],
    sortable: Boolean,
    align: {
      type: String,
      validator (val) {
        return !val || val === 'left' || val === 'right' || val === 'center'
      }
    },
    span: Function
  },
  data () {
    return {
      id: uniqueId('veui-table-column-')
    }
  },
  render () {},
  created () {
    let index = getIndexOfType(this, 'table-column')

    const props = ['title', 'field', 'sortable', 'width', 'align', 'span']

    this.table.add({
      ...pick(this, ...props, 'id'),
      index,
      hasFoot: () => {
        return !!this.$scopedSlots.foot
      },
      renderBody: item => {
        if (this.$scopedSlots.default) {
          return this.$scopedSlots.default(item)
        }
        return item[this.field]
      },
      renderHead: () => {
        return this.$slots.head || this.title
      },
      renderFoot: () => {
        return this.$slots.foot || null
      }
    })
  },
  destroyed () {
    this.table.removeById(this.id)
  }
}
</script>

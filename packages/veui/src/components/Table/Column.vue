<script>
import { pick } from 'lodash'
import { table } from '../../mixins'

export default {
  name: 'veui-table-column',
  mixins: [table],
  props: {
    title: String,
    field: {
      type: String,
      required: true
    },
    width: [String, Number],
    sortable: Boolean,
    order: [String, Boolean],
    align: {
      type: String,
      validate (val) {
        if (val && val !== 'left' && val !== 'right' && val !== 'center') {
          return false
        }
      }
    }
  },
  render () {},
  mounted () {
    let table = this.table
    if (!table) {
      return
    }
    let slots = this.$scopedSlots
    table.columns.push({
      ...pick(this.$props, 'title', 'field', 'sortable', 'width', 'align'),
      hasFoot: !!slots.foot,
      renderBody: slots.default
        ? data => slots.default(data)
        : ({col, item}) => item[col.field],
      renderHead: slots.head
        ? data => slots.head(data)
        : ({col, item}) => col.title,
      renderFoot: slots.foot
        ? data => slots.foot(data)
        : () => {}
    })
  }
}
</script>

<template>
  <col :width="width">
</template>

<script>
import mixin from './mixin'

export default {
  name: 'veui-table-column',
  mixins: [mixin],
  props: {
    title: String,
    field: String,
    width: [String, Number]
  },
  mounted () {
    let table = this.table
    if (!table) {
      return
    }
    let { title, field, $scopedSlots: slots } = this
    table.columns.push({
      title,
      field,
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

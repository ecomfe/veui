<template></template>

<script>
import { pick } from 'lodash'
import mixin from './mixin'

export default {
  name: 'veui-table-column',
  mixins: [mixin],
  props: {
    title: String,
    field: {
      type: String,
      required: true
    },
    width: [String, Number],
    sortable: Boolean,
    order: [String, Boolean]
  },
  mounted () {
    let table = this.table
    if (!table) {
      return
    }
    let slots = this.$scopedSlots
    table.columns.push({
      ...pick(this.$props, 'title', 'field', 'sortable', 'width'),
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

<template>
  <col>
</template>

<script>
export default {
  name: 'veui-table-column',
  props: ['title', 'field'],
  methods: {
    getTable () {
      let current = this.$parent
      while (current) {
        if (current.tableId) {
          return current
        }
        current = current.$parent
      }
    }
  },
  mounted () {
    let table = this.getTable()
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

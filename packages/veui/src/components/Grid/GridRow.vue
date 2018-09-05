<template>
<div
  class="veui-grid-row"
  :style="style"
><slot/></div>
</template>

<script>
export default {
  name: 'veui-grid-row',
  provide () {
    let { columns, gutter, flex } = this

    return {
      columns,
      gutter,
      flex
    }
  },
  inject: ['columns', 'gutter', 'flex'],
  computed: {
    style () {
      let { flex, gutter } = this
      return {
        ...flex
          ? {
            display: 'flex'
          }
          : {},
        'margin-right': `-${gutter / 2}px`,
        'margin-left': `-${gutter / 2}px`
      }
    }
  }
}
</script>

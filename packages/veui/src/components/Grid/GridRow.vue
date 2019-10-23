<template>
<div
  :class="$c('grid-row')"
  :style="style"
>
  <slot/>
</div>
</template>

<script>
import prefix from '../../mixins/prefix'

export default {
  name: 'veui-grid-row',
  mixins: [prefix],
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
        ...(flex
          ? {
            display: ['-webkit-box', '-ms-flexbox', 'flex']
          }
          : {}),
        'margin-right': `-${gutter / 2}px`,
        'margin-left': `-${gutter / 2}px`
      }
    }
  }
}
</script>

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
    let { columns, gutter } = this

    return {
      columns,
      gutter
    }
  },
  inject: ['columns', 'gutter'],
  computed: {
    style () {
      let { gutter } = this
      return {
        'margin-right': `-${gutter / 2}px`,
        'margin-left': `-${gutter / 2}px`
      }
    }
  }
}
</script>

<template>
<div :class="$c('grid-row')" :style="style">
  <slot/>
</div>
</template>

<script>
import ui from '../../mixins/ui'
import '../../common/global'

export default {
  name: 'veui-grid-row',
  uiTypes: ['transparent'],
  mixins: [ui],
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

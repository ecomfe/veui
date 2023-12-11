<template>
<div :class="$c('input-group')" :ui="realUi">
  <slot/>
</div>
</template>

<script>
import ui from '../mixins/ui'
import '../common/global'

export default {
  name: 'veui-input-group',
  mixins: [ui]
}
</script>

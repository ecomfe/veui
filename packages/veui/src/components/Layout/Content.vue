<template>
<div :class="$c('layout-content')">
  <slot/>
</div>
</template>

<script>
import ui from '../../mixins/ui'

export default {
  name: 'veui-content',
  uiTypes: ['transparent'],
  mixins: [ui]
}
</script>

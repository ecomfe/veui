<template>
<span
  :class="$c('span')"
  :ui="realUi"
>
  <slot/>
</span>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'

export default {
  name: 'veui-span',
  mixins: [prefix, ui]
}
</script>

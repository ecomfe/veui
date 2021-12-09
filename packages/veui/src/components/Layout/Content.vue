<template>
<div :class="$c('layout-content')">
  <slot/>
</div>
</template>

<script>
import prefix from '../../mixins/prefix'

export default {
  name: 'veui-content',
  mixins: [prefix]
}
</script>

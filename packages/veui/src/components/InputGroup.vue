<template>
<div
  :class="$c('input-group')"
  :ui="realUi"
><slot/></div>
</template>

<script>
import ui from '../mixins/ui'
import prefix from '../mixins/prefix'

export default {
  name: 'veui-input-group',
  mixins: [ui, prefix]
}
</script>

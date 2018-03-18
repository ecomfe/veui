<template>
<span class="veui-span" :ui="ui"><slot/></span>
</template>

<script>
import ui from '../mixins/ui'

export default {
  name: 'veui-span',
  mixins: [ui]
}
</script>

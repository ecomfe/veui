<template>
<span :class="$c('span')" v-bind="$attrs" :ui="realUi" v-on="$listeners">
  <slot/>
</span>
</template>

<script>
import '../common/global'
import ui from '../mixins/ui'

export default {
  name: 'veui-span',
  uiTypes: ['transparent'],
  mixins: [ui]
}
</script>

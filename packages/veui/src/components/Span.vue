<template>
<span :class="$c('span')" v-bind="$attrs" v-on="$listeners">
  <slot/>
</span>
</template>

<script>
import '../common/global'
import prefix from '../mixins/prefix'

export default {
  name: 'veui-span',
  uiTypes: ['transparent'],
  mixins: [prefix]
}
</script>

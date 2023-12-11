<template>
<header
  :class="{
    [$c('layout-header')]: true,
    [$c('layout-header-sticky')]: sticky
  }"
>
  <slot/>
</header>
</template>

<script>
import ui from '../../mixins/ui'

export default {
  name: 'veui-header',
  uiTypes: ['transparent'],
  mixins: [ui],
  props: {
    sticky: Boolean
  }
}
</script>

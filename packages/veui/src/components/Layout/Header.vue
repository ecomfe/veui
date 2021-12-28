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
import prefix from '../../mixins/prefix'

export default {
  name: 'veui-header',
  mixins: [prefix],
  props: {
    sticky: Boolean
  }
}
</script>

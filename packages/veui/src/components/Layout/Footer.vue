<template>
<footer
  :class="{
    [$c('layout-footer')]: true,
    [$c('layout-footer-sticky')]: sticky
  }"
>
  <slot/>
</footer>
</template>

<script>
import prefix from '../../mixins/prefix'

export default {
  name: 'veui-footer',
  mixins: [prefix],
  props: {
    sticky: Boolean
  }
}
</script>

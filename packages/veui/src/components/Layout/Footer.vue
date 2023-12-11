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
import ui from '../../mixins/ui'

export default {
  name: 'veui-footer',
  uiTypes: ['transparent'],
  mixins: [ui],
  props: {
    sticky: Boolean
  }
}
</script>

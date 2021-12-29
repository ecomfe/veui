<template>
<transition
  :name="realName"
  v-bind="$attrs"
>
  <slot/>
</transition>
</template>

<script>
import { prefixify } from '../mixins/prefix'

const BUILTIN_TRANSITIONS = [
  'fade',
  'fade-scale',
  'fade-scale-x',
  'fade-scale-y',
  'translate',
  'move',
  'fade-translate-scale'
]

export default {
  name: 'veui-transition',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      validator (val) {
        return BUILTIN_TRANSITIONS.indexOf(val) >= 0
      }
    }
  },
  computed: {
    realName () {
      return prefixify(`transition-${this.name}`)
    }
  }
}
</script>

<template>
<div
  class="veui-badge"
  :class="{
    'veui-badge-standalone': standalone
  }"
>
  <slot/>
  <transition name="veui-badge">
    <span
      v-if="!hidden"
      class="veui-badge-main"
      :class="{
        [`veui-badge-${content && !standalone ? 'label' : 'dot'}`]: true,
        [`veui-badge-${type}`]: true
      }"
    >{{ !standalone ? content : '' }}</span>
  </transition>
  <span
    v-if="standalone && value"
    class="veui-badge-standalone-label"
  >{{ value }}</span>
</div>
</template>

<script>
import ui from '../mixins/ui'
import { isNumber } from 'lodash'
import config from '../managers/config'

config.defaults({
  'badge.max': 999
})

export default {
  name: 'veui-badge',
  mixins: [ui],
  props: {
    value: [Number, String],
    max: {
      type: Number,
      default: config.get('badge.max'),
      validator (val) {
        return Math.floor(val) === val && val > 0
      }
    },
    hidden: Boolean,
    type: {
      type: String,
      default: 'error'
    }
  },
  computed: {
    standalone () {
      return !this.$slots.default
    },
    content () {
      if (!isNumber(this.value)) {
        return this.value ? this.value : null
      }
      return this.max && this.value > this.max
        ? `${this.max}+`
        : `${this.value}`
    }
  }
}
</script>

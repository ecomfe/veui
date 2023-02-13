<template>
<div :class="rootClass">
  <div :class="innerClass" :style="innerStyle">
    <slot/>
  </div>
</div>
</template>

<script>
import prefix from '../mixins/prefix'
import { getEnumValidator } from '../utils/helper'

export default {
  name: 'veui-stack',
  mixins: [prefix],
  props: {
    direction: {
      type: String,
      validator: getEnumValidator(['row', 'column']),
      default: 'row'
    },
    wrap: Boolean,
    inline: Boolean,
    align: {
      type: String,
      validator: getEnumValidator(['start', 'end', 'center', 'stretch'])
    },
    justify: {
      type: String,
      validator: getEnumValidator(['start', 'end', 'center', 'space-between']),
      default: 'start'
    },
    gap: [String, Number]
  },
  computed: {
    realAlign () {
      return this.align == null
        ? this.direction === 'row'
          ? 'center'
          : 'stretch'
        : this.align
    },
    rootClass () {
      return {
        [this.$c('stack')]: true,
        [this.$c(`stack-wrap`)]: this.wrap,
        [this.$c(`stack-inline`)]: this.inline,
        [this.$c(`stack-${this.direction}`)]: this.direction,
        [this.$c(`stack-gap`)]: this.gap
      }
    },
    innerClass () {
      return {
        [this.$c('stack-inner')]: true,
        [this.$c(`stack-inner-gap-${this.gap}`)]: typeof this.gap === 'string',
        [this.$c(`stack-inner-align-${this.realAlign}`)]: this.realAlign,
        [this.$c(`stack-inner-justify-${this.justify}`)]: this.justify
      }
    },
    innerStyle () {
      let { gap } = this
      return typeof gap === 'number' && gap > 0
        ? {
          [`--${this.$c('stack-gap')}`]: `${gap}px`
        }
        : null
    }
  }
}
</script>

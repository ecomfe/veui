<template>
<div v-if="type === 'number'" :class="rootClass">
  {{ index + 1 }}/{{ labels.length }}
</div>
<nav v-else :class="rootClass">
  <button
    v-for="(label, i) in labels"
    :key="i"
    type="button"
    tabindex="-1"
    :class="{
      [$c('carousel-indicator-item')]: true,
      [$c('carousel-indicator-item-current')]: index === i
    }"
    :aria-label="label"
    @click="$emit('trigger', i, 'click')"
    @focus="$emit('trigger', i, 'focus')"
    @mouseenter="$emit('trigger', i, 'hover')"
  />
</nav>
</template>

<script>
import prefix from '../../mixins/prefix'

export default {
  name: 'veui-carousel-indicator',
  mixins: [prefix],
  props: {
    type: String,
    labels: Array,
    index: Number,
    vertical: Boolean
  },
  computed: {
    rootClass () {
      return {
        [this.$c('carousel-indicator')]: true,
        [this.$c(`carousel-indicator-${this.type}s`)]: true,
        [this.$c(`carousel-indicator-vertical`)]: this.vertical,
        [this.$c(`carousel-indicator-horizontal`)]: !this.vertical
      }
    }
  }
}
</script>

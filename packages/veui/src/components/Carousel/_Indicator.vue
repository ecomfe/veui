<template>
<div
  v-if="indicator === 'number'"
  :class="[$c('carousel-indicator'), $c('carousel-indicator-numbers')]"
>
  {{ index + 1 }}/{{ labels.length }}
</div>
<nav
  v-else
  :class="{
    [$c('carousel-indicator')]: true,
    [$c(`carousel-indicator-${indicator}s`)]: true,
    [$c(`carousel-indicator-vertical`)]: vertical,
    [$c(`carousel-indicator-horizontal`)]: !vertical
  }"
>
  <button
    v-for="(label, idx) in labels"
    :key="idx"
    type="button"
    tabindex="-1"
    :class="{
      [$c('carousel-indicator-item')]: true,
      [$c('carousel-indicator-item-current')]: index === idx
    }"
    :aria-label="label"
    @click="$emit('trigger', idx, 'click')"
    @focus="$emit('trigger', idx, 'focus')"
    @mouseenter="$emit('trigger', idx, 'hover')"
  />
</nav>
</template>

<script>
import prefix from '../../mixins/prefix'

export default {
  name: 'veui-carousel-indicator',
  mixins: [prefix],
  props: {
    indicator: String,
    labels: Array,
    index: Number,
    vertical: Boolean
  }
}
</script>

<template>
<div
  v-if="indicator === 'number'"
  :class="[$c('carousel-indicator'), $c('carousel-indicator-numbers')]"
>
  {{ index + 1 }}/{{ count }}
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
    v-for="i in count"
    :key="i - 1"
    type="button"
    tabindex="-1"
    :class="{
      [$c('carousel-indicator-item')]: true,
      [$c('carousel-indicator-item-current')]: index === i - 1
    }"
    aria-label="item.label || t('pageIndex', { index: i + 1 })"
    @click="$emit('trigger', i - 1, 'click')"
    @focus="$emit('trigger', i - 1, 'focus')"
    @mouseenter="$emit('trigger', i - 1, 'hover')"
  />
</nav>
</template>

<script>
import prefix from '../../mixins/prefix'

export default {
  name: 'veui-carousel-indicator',
  mixins: [prefix],
  props: {
    indicator: {
      type: String,
      validator (value) {
        return ['radio', 'number', 'dot', 'none'].indexOf(value) >= 0
      }
    },
    count: Number,
    index: {
      type: Number,
      default: 0
    },
    vertical: Boolean
  }
}
</script>

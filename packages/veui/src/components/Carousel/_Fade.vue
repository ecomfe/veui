<template>
<transition-group
  :name="$c('carousel-item')"
  :class="{
    [$c('carousel-items')]: true,
    [$c('carousel-items-fade')]: true
  }"
  tag="ol"
>
  <li
    v-for="(item, idx) in datasource"
    v-show="idx === index"
    ref="item"
    :key="item.src"
    :class="{
      [$c('carousel-item')]: true,
      [$c('carousel-item-current')]: idx === index
    }"
    tabindex="0"
    @focusin="focusedIndex = idx"
    @focusout="focusedIndex = null"
  >
    <slot
      v-if="idx === index || isPreload(idx)"
      name="item"
      v-bind="{ ...item, preload: isPreload(idx) }"
      :index="idx"
    >
      <div
        :class="$c('carousel-item-image')"
        :style="{
          ...aspectRatioStyle,
          'background-image': `url(${item.src})`
        }"
      >
        <img
          :class="$c('sr-only')"
          :src="item.src"
          :alt="item.alt"
        >
      </div>
    </slot>
  </li>
</transition-group>
</template>

<script>
import carousel from './mixin'

export default {
  name: 'veui-carousel-fade',
  mixins: [carousel]
}
</script>

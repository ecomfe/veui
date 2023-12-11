<template>
<transition-group
  :name="$c('carousel-item')"
  :class="{
    [$c('carousel-items')]: true,
    [$c('carousel-items-fade')]: true
  }"
  tag="ol"
  @after-leave="handleTransitionEnd"
>
  <li
    v-for="(item, idx) in datasource"
    v-show="idx === index"
    ref="item"
    :key="`item#${idx}`"
    :class="{
      [$c('carousel-item')]: true,
      [$c('carousel-item-current')]: idx === index
    }"
    tabindex="-1"
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
        :class="$c('carousel-item-media')"
        :style="{
          ...aspectRatioStyle,
          ...(item.type !== 'video' && {
            'background-image': `url(${item.src})`
          })
        }"
      >
        <video
          v-if="item.type === 'video'"
          :ref="`video#${idx}`"
          :class="$c('carousel-item-video')"
          :src="item.src"
          :alt="item.alt"
          preload="auto"
          tabindex="-1"
          v-bind="options.video"
          :autoplay="idx === index && options.video.autoplay"
          :muted="isAutoplay || options.video.muted"
        />
        <img v-else :class="$c('sr-only')" :src="item.src" :alt="item.alt">
      </div>
    </slot>
  </li>
</transition-group>
</template>

<script>
import carousel from './_mixin'

export default {
  name: 'veui-carousel-fade',
  uiTypes: ['transparent'],
  mixins: [carousel],
  watch: {
    index (_, oldVal) {
      if (oldVal != null) {
        this.pauseVideos(oldVal)
      }
    }
  },
  methods: {
    handleTransitionEnd () {
      // 过渡完成再 reset 视频，以免画面抖动
      this.resetVideos()
      this.playVideos(this.index)
    },
    focusCurrent (index) {
      this.$refs.item[index].focus()
    }
  }
}
</script>

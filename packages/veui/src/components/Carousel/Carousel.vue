<template>
<div
  :class="{
    [$c('carousel')]: true,
    [$c('focus')]: focused,
    [$c('carousel-vertical')]: vertical,
    [$c(`carousel-gutter`)]: hasGutter,
    [$c(`carousel-${effect}`)]: true,
    [$c('carousel-outside-indicator')]: isOutsideIndicator,
    [$c('carousel-outside-controls')]: isOutsideControl,
    [$c(`carousel-aspect-ratio`)]: slideAspectRatio
  }"
  :ui="realUi"
  :tabindex="0"
  @focusin="handleFocusIn"
  @focusout="handleFocusOut"
  @mouseleave="handleFocusOut"
  @keydown.left="handleKeydown(-1, $event, false)"
  @keydown.right="handleKeydown(1, $event, false)"
  @keydown.up="handleKeydown(-1, $event, true)"
  @keydown.down="handleKeydown(1, $event, true)"
>
  <div :class="$c('carousel-player')">
    <div :class="$c('carousel-viewport-wrap')">
      <div
        :class="$c('carousel-viewport')"
        @mouseenter="handleEnter"
        @mouseleave="handleLeave"
      >
        <component
          :is="`veui-carousel-${effect}`"
          ref="effect"
          :datasource="datasource"
          :index.sync="realIndex"
          :slide-aspect-ratio="slideAspectRatio"
          :preload-range="preloadRange"
          :options="options"
          v-bind="isFade ? {} : slideProps"
        >
          <template slot="item" slot-scope="props">
            <slot name="item" v-bind="props"/>
          </template>
        </component>
      </div>
      <div
        v-if="vertical && slideAspectRatio && !isFade"
        :class="$c('carousel-dummy')"
        :style="dummyStyle"
      />
    </div>
    <template v-if="hasControls">
      <veui-button
        :ui="controlUi"
        :class="{
          [$c('carousel-control')]: true,
          [$c('carousel-control-prev')]: true,
          [$c('carousel-control-vertical')]: vertical
        }"
        :disabled="!wrap && realIndex === 0"
        tabindex="-1"
        @click="doStep(-1)"
      >
        <veui-icon :name="icons.prev" :aria-label="t('prev')"/>
      </veui-button>
      <veui-button
        :ui="controlUi"
        :class="{
          [$c('carousel-control')]: true,
          [$c('carousel-control-next')]: true,
          [$c('carousel-control-vertical')]: vertical
        }"
        :disabled="!wrap && realIndex === groupCount - 1"
        tabindex="-1"
        @click="doStep(1)"
      >
        <veui-icon :name="icons.next" :aria-label="t('next')"/>
      </veui-button>
    </template>
  </div>
  <veui-carousel-indicator
    v-if="indicator !== 'none'"
    :class="{
      [$c(`carousel-indicator-left`)]: vertical && !isEndIndicator,
      [$c(`carousel-indicator-right`)]: vertical && isEndIndicator,
      [$c(`carousel-indicator-top`)]: !vertical && !isEndIndicator,
      [$c(`carousel-indicator-bottom`)]: !vertical && isEndIndicator,
      [$c(`carousel-indicator-outside`)]: isOutsideIndicator
    }"
    :type="indicator"
    :index="realIndex"
    :labels="indicatorLabels"
    :vertical="vertical"
    @trigger="handleIndicator"
  />
  <div :class="$c('sr-only')" aria-live="polite" aria-atomic="true">
    {{ t('detail', { index: realIndex + 1, total: datasource.length }) }}
  </div>
</div>
</template>

<script>
import { includes, pick, range } from 'lodash'
import Button from '../Button'
import Icon from '../Icon'
import Indicator from './_Indicator'
import Slide, { props as slideProps } from './_Slide'
import Fade from './_Fade'
import ui from '../../mixins/ui'
import i18n from '../../mixins/i18n'
import carousel from '../../mixins/carousel'
import { CUSTOM_GUTTER, FALLBACK_GUTTER, getRatio } from './_mixin'
import '../../common/global'

export default {
  name: 'veui-carousel',
  components: {
    'veui-button': Button,
    'veui-icon': Icon,
    'veui-carousel-indicator': Indicator,
    'veui-carousel-fade': Fade,
    'veui-carousel-slide': Slide
  },
  mixins: [ui, i18n, carousel],
  props: {
    indicator: {
      type: String,
      default: 'bar',
      validator (value) {
        return includes(['bar', 'radio', 'number', 'none', 'dot'], value)
      }
    },
    indicatorAlign: {
      type: String,
      default: 'start',
      validator (value) {
        return includes(['start', 'end'], value)
      }
    },
    indicatorPosition: {
      type: String,
      default: 'inside',
      validator (value) {
        return includes(['inside', 'outside'], value)
      }
    },
    controls: Boolean,
    controlsPosition: {
      type: String,
      validator (value) {
        return includes(['inside', 'outside'], value)
      }
    },
    switchTrigger: {
      type: String,
      default: 'click',
      validator (value) {
        return includes(['hover', 'click'], value)
      }
    },
    autoplay: Boolean,
    pauseOnHover: Boolean,
    interval: {
      type: Number,
      default: 3000
    },
    vertical: Boolean,
    effect: {
      type: String,
      default: 'fade'
    },
    slideAspectRatio: {
      type: [String, Number],
      validator (val) {
        if (val != null) {
          if (typeof val === 'number') {
            return val > 0
          }
          let splited = val.split('/').map(Number)
          return splited.length === 2 && splited.every((i) => i > 0)
        }
        return true
      }
    },
    options: {
      type: Object,
      default () {
        return {
          video: {
            muted: true,
            autoplay: true,
            controls: true,
            loop: true
          }
        }
      }
    },
    ...slideProps
  },
  computed: {
    isFade () {
      return this.effect === 'fade'
    },
    slideProps () {
      return pick(this.$props, Object.keys(slideProps))
    },
    hasControls () {
      // 非自动播放，必须有 controls
      return this.autoplay ? this.controls : true
    },
    isOutsideControl () {
      return this.hasControls && this.controlsPosition === 'outside'
    },
    controlUi () {
      return this.uiParts[this.isOutsideControl ? 'controlOutside' : 'control']
    },
    hasIndicator () {
      return this.indicator !== 'none'
    },
    indicatorLabels () {
      let isSingle =
        this.isFade || (this.slidesPerView === 1 && this.slidesPerGroup === 1)
      return isSingle
        ? this.datasource.map(
          ({ label }, index) => label || this.t('pageIndex', { index })
        )
        : range(1, this.groupCount + 1).map((index) =>
          this.t('pageIndex', { index })
        )
    },
    isEndIndicator () {
      return this.indicatorAlign === 'end'
    },
    isOutsideIndicator () {
      return (
        this.isEndIndicator &&
        !this.vertical &&
        this.indicatorPosition === 'outside'
      )
    },
    /**
     * 在垂直转场的情况下，利用 padding 来撑开容器（内部是多屏在一起，没法靠内容撑开）
     */
    dummyStyle () {
      let ratio = getRatio(this.slideAspectRatio)
      const itemsHeight = this.slidesPerView * ratio * 100
      const gutterCount = this.slidesPerView - 1
      return [
        {
          'padding-top': `calc(${itemsHeight}% + ${gutterCount} * ${FALLBACK_GUTTER})`
        },
        {
          'padding-top': `calc(${itemsHeight}% + ${gutterCount} * var(${CUSTOM_GUTTER}))`
        }
      ]
    },
    hasGutter () {
      return !this.isFade && !!(this.slidesPerView - 1)
    },
    realSlidesPerGroup () {
      return this.isFade ? 1 : this.slidesPerGroup
    },
    groupCount () {
      return Math.ceil(this.datasource.length / this.realSlidesPerGroup)
    }
  },
  mounted () {
    this.initPlay()

    this.$watch(
      () => [
        this.interval,
        this.realIndex,
        this.autoplay,
        this.vertical,
        this.effect
      ],
      this.initPlay
    )
  },
  beforeDestroy () {
    this.stop()
  },
  methods: {
    canStep (step) {
      const result =
        !this.wrap &&
        (this.realIndex + step < 0 || this.realIndex + step >= this.groupCount)
      return !result
    },
    select (index, event) {
      if (event !== this.switchTrigger) {
        return
      }
      if (this.effect === 'slide') {
        // 不能仅仅更新 index，再根据 index 来播放（浏览器会拦截，认为非用户触发）
        this.$refs.effect.goToGroup(index)
      }
      this.triggerChange(index)

      if (event === 'click') {
        this.focusCurrent()
      }
    },
    handleIndicator (index, event) {
      if (event === 'focus' && this.switchTrigger === 'hover') {
        event = 'hover'
      }
      if (index !== this.realIndex) {
        this.select(index, event)
      }
    },
    initPlay () {
      this.stop()
      if (!this.autoplay) {
        return
      }
      this.playTimer = setInterval(() => {
        this.doStep(1)
      }, this.interval)
    },
    stop () {
      clearTimeout(this.playTimer)
    },
    handleEnter () {
      if (this.pauseOnHover) {
        this.stop()
      }
    },
    handleLeave () {
      if (this.pauseOnHover) {
        this.initPlay()
      }
    },
    // TODO: mixin 那个不太适合了
    focusCurrent () {
      clearTimeout(this.focusTimer)
      this.focusTimer = setTimeout(() => {
        this.focused = true
        this.focusedIndex = this.realIndex
        this.$refs.effect.focusCurrent(this.realIndex)
      })
    },
    // TODO 统一
    doStep (i, focus) {
      if (this.canStep(i)) {
        if (this.isFade) {
          this.step(i, focus)
        } else {
          this.$refs.effect.step(i)
          if (focus) {
            this.focusCurrent()
          }
        }
      }
    },
    handleKeydown (step, event, vertical) {
      if (this.vertical === vertical) {
        this.doStep(step, true)
      }
      // 避免按上下导致页面滚动
      event.preventDefault()
    }
  }
}
</script>

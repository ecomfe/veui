<template>
<div
  :class="{
    [$c('carousel')]: true,
    [$c('focus')]: focused,
    [$c('carousel-vertical')]: vertical,
    [$c(`carousel-gutter`)]: hasGutter,
    [$c(`carousel-${effect}`)]: true,
    [$c('carousel-outside-indicator')]: realIndicator.isOutside,
    [$c('carousel-outside-controls')]: isOutside,
    [$c(`carousel-aspect-ratio`)]: aspectRatio
  }"
  :ui="realUi"
  :style="style"
  @focusin="handleFocusIn"
  @focusout="handleFocusOut"
  @mouseleave="handleFocusOut"
  @keydown.left="step(-1, true)"
  @keydown.right="step(1, true)"
>
  <div :class="$c('carousel-viewport-wrap')">
    <div
      :class="$c('carousel-viewport')"
      @mouseenter="handleEnter"
      @mouseleave="handleLeave"
    >
      <veui-carousel-fade
        v-if="isFade"
        :datasource="datasource"
        :index="realIndex"
        :aspect-ratio="aspectRatio"
      />
      <veui-carousel-slide
        v-else
        ref="slide"
        :datasource="datasource"
        :index.sync="realIndex"
        :vertical="vertical"
        :effect="effect"
        :wrap="wrap"
        :aspect-ratio="aspectRatio"
        v-bind="slideProps"
      />
    </div>
    <veui-button
      :ui="uiParts.control"
      :class="{
        [$c('carousel-control')]: true,
        [$c('carousel-control-prev')]: true,
        [$c('carousel-control-vertical')]: vertical
      }"
      :disabled="!wrap && realIndex === 0"
      @click="doStep(-1)"
    >
      <veui-icon
        :name="icons.prev"
        :aria-label="t('prev')"
      />
    </veui-button>
    <veui-button
      :ui="uiParts.control"
      :class="{
        [$c('carousel-control')]: true,
        [$c('carousel-control-next')]: true,
        [$c('carousel-control-vertical')]: vertical
      }"
      :disabled="!wrap && realIndex === count - 1"
      @click="doStep(1)"
    >
      <veui-icon
        :name="icons.next"
        :aria-label="t('next')"
      />
    </veui-button>
  </div>
  <veui-carousel-indicator
    v-if="realIndicator.type !== 'none'"
    :class="{
      [$c(`carousel-indicator-left`)]: vertical && !realIndicator.isEnd,
      [$c(`carousel-indicator-right`)]: vertical && realIndicator.isEnd,
      [$c(`carousel-indicator-top`)]: !vertical && !realIndicator.isEnd,
      [$c(`carousel-indicator-bottom`)]: !vertical && realIndicator.isEnd,
      [$c(`carousel-indicator-outside`)]: realIndicator.isOutside
    }"
    :indicator="realIndicator.type"
    :index="realIndex"
    :count="pageCount"
    :vertical="vertical"
    @trigger="handleIndicator"
  />
  <div
    :class="$c('sr-only')"
    aria-live="polite"
    aria-atomic="true"
  >
    {{ t('detail', { index: realIndex + 1, total: datasource.length }) }}
  </div>
  <div
    v-if="vertical && aspectRatio && !isFade"
    :class="$c('carousel-dummy')"
    :style="dummyStyle"
  />
</div>
</template>

<script>
import { includes, pick } from 'lodash'
import Button from '../Button'
import Icon from '../Icon'
import Indicator from './_Indicator'
import Slide, { Props as SlidePropDefs } from './_Slide'
import Fade from './_Fade'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import i18n from '../../mixins/i18n'
import useControllable from '../../mixins/controllable'
import carousel from '../../mixins/carousel'

const CUSTOM_GUTTER = '--dls-carousel-gutter'

export default {
  name: 'veui-carousel',
  components: {
    'veui-button': Button,
    'veui-icon': Icon,
    'veui-carousel-indicator': Indicator,
    'veui-carousel-fade': Fade,
    'veui-carousel-slide': Slide
  },
  mixins: [prefix, ui, i18n, useControllable(['index']), carousel],
  props: {
    indicator: {
      type: String,
      default: 'radio',
      validator (value) {
        // return includes(['radio', 'number', 'none', 'dot'], value)
        return true
      }
    }, // start/end outside/inside
    controls: {
      type: String,
      default: 'inside',
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
    aspectRatio: String,
    ...SlidePropDefs
  },
  computed: {
    slideProps () {
      return pick(this.$props, Object.keys(SlidePropDefs))
    },
    isFade () {
      return this.effect === 'fade'
    },
    style () {
      return {
        // TODO
        '--dls-carousel-gutter': '12px'
      }
    },
    dummyStyle () {
      const [w, h] = this.aspectRatio.split(':').map(Number)
      let itemsHeight = this.showCount * (h / w) * 100
      return {
        'padding-top': `calc(${itemsHeight}% + ${this.showCount -
          1} * var(${CUSTOM_GUTTER}))`
      }
    },
    hasGutter () {
      return !!(this.showCount - 1)
    },
    realStep () {
      return this.isFade ? 1 : this.stepCount
    },
    pageCount () {
      return Math.ceil(this.datasource.length / Math.floor(this.realStep))
    },
    realIndicator () {
      const type = /(?:^|\s)(radio|number|none|dot)(?:$|\s)/.exec(
        this.indicator
      )[1]
      const isNone = type === 'none'
      const isEnd = !isNone && /(?:^|\s)(end)(?:$|\s)/.test(this.indicator)
      return {
        type,
        isEnd,
        isOutside:
          isEnd &&
          !this.vertical &&
          /(?:^|\s)(outside)(?:$|\s)/.test(this.indicator)
      }
    },
    isOutside () {
      return this.controls === 'outside'
    }
  },
  mounted () {
    this.initPlay()

    this.$watch(
      () => [this.interval, this.realIndex, this.autoplay],
      this.initPlay
    )
  },
  beforeDestroy () {
    this.stop()
    clearTimeout(this.focusTimer)
  },
  methods: {
    select (index, event) {
      if (event !== this.switchTrigger) {
        return
      }
      if (this.effect === 'slide') {
        this.$refs.slide.setTransition(index, 0.2)
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
        this.step(1)
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
    doStep (i) {
      if (this.isFade) {
        this.step(i)
        return
      }
      this.$refs.slide.stepSlide(i)
    }
  }
}
</script>

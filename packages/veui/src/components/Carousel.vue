<template>
<div
  :class="{
    [$c('carousel')]: true,
    [$c('focus')]: focused
  }"
  :ui="realUi"
  @focusin="handleFocusIn"
  @focusout="handleFocusOut"
  @mouseleave="handleFocusOut"
  @keydown.left="step(-1, true)"
  @keydown.right="step(1, true)"
>
  <div
    :class="$c('carousel-viewport')"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <transition-group
      :name="$c('carousel-item')"
      :class="$c('carousel-items')"
      tag="ol"
    >
      <li
        v-for="(item, i) in datasource"
        v-show="realIndex === i"
        ref="item"
        :key="`i#${item.src}`"
        :class="{
          [$c('carousel-item')]: true,
          [$c('carousel-item-current')]: realIndex === i
        }"
        tabindex="0"
        @focusin="focusedIndex = i"
        @focusout="focusedIndex = null"
      >
        <slot
          v-if="realIndex === i || isPreload(i)"
          v-bind="{ ...item, preload: isPreload(i) }"
          :index="i"
        >
          <div
            :class="$c('carousel-item-image')"
            :style="{
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
  </div>
  <div
    v-if="indicator === 'number'"
    :class="$c('carousel-indicator-numbers')"
  >
    {{ realIndex + 1 }}
    <span :class="$c('carousel-indicator-numbers-separator')"/>
    {{ count }}
  </div>
  <nav
    v-else-if="indicator !== 'none'"
    :class="$c(`carousel-indicator-${indicator}s`)"
  >
    <button
      v-for="(item, i) in datasource"
      :key="i"
      type="button"
      tabindex="-1"
      :class="{
        [$c('carousel-indicator-item')]: true,
        [$c('carousel-indicator-item-current')]: realIndex === i
      }"
      @click="select(i, 'click')"
      @focus="switchTrigger === 'hover' && select(i, 'hover')"
      @mouseenter="select(i, 'hover')"
    >
      {{ item.label || t('pageIndex', { index: i + 1 }) }}
    </button>
  </nav>
  <veui-button
    :ui="uiParts.control"
    :class="[$c('carousel-control'), $c('carousel-control-prev')]"
    :disabled="!wrap && realIndex === 0"
    @click="step(-1)"
  >
    <veui-icon
      :name="icons.prev"
      :aria-label="t('prev')"
    />
  </veui-button>
  <veui-button
    :ui="uiParts.control"
    :class="[$c('carousel-control'), $c('carousel-control-next')]"
    :disabled="!wrap && realIndex === count - 1"
    @click="step(1)"
  >
    <veui-icon
      :name="icons.next"
      :aria-label="t('next')"
    />
  </veui-button>
  <div
    :class="$c('sr-only')"
    aria-live="polite"
    aria-atomic="true"
  >
    {{ t('detail', { index: realIndex + 1, total: datasource.length }) }}
  </div>
</div>
</template>

<script>
import { includes } from 'lodash'
import Button from './Button'
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import makeControllable from '../mixins/controllable'
import { contains } from '../utils/dom'

const DEFAULT_LAZY_OPTIONS = {
  preload: 1
}

export default {
  name: 'veui-carousel',
  components: {
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [prefix, ui, i18n, makeControllable(['index'])],
  props: {
    datasource: {
      type: Array,
      default () {
        return []
      }
    },
    index: {
      type: Number,
      default: 0
    },
    indicator: {
      type: String,
      default: 'radio',
      validator (value) {
        return includes(['radio', 'number', 'tab', 'none'], value)
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
    wrap: Boolean,
    lazy: {
      type: [Boolean, Object],
      default: false
    }
  },
  data () {
    return {
      focused: false,
      focusedIndex: null
    }
  },
  computed: {
    count () {
      return this.datasource.length
    },
    realLazy () {
      if (!this.lazy) {
        return false
      }
      if (this.lazy === true) {
        return DEFAULT_LAZY_OPTIONS
      }

      return {
        ...DEFAULT_LAZY_OPTIONS,
        ...this.lazy
      }
    },
    preloadRange () {
      if (!this.realLazy) {
        return [0, Number.POSITIVE_INFINITY]
      }

      return [
        (this.count + this.realIndex - this.realLazy.preload) % this.count,
        (this.count + this.realIndex + this.realLazy.preload) % this.count
      ]
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
    step (delta, focus) {
      if (
        !this.wrap &&
        (this.realIndex + delta < 0 || this.realIndex + delta > this.count - 1)
      ) {
        return
      }

      this.triggerChange((this.realIndex + delta + this.count) % this.count)

      if (focus) {
        this.focusCurrent()
      }
    },
    select (index, event) {
      if (event !== this.switchTrigger) {
        return
      }

      this.triggerChange(index)

      if (event === 'click') {
        this.focusCurrent()
      }
    },
    triggerChange (value) {
      let oldValue = this.realIndex
      this.setReal('index', value)
      this.$emit('change', value, oldValue)
    },
    focusCurrent () {
      clearTimeout(this.focusTimer)
      this.focusTimer = setTimeout(() => {
        this.focused = true
        this.focusedIndex = this.realIndex
        this.$refs.item[this.realIndex].focus()
      })
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
    handleFocusIn () {
      this.focused = true
    },
    handleFocusOut (e) {
      if (!contains(this.$el, e.relatedTarget)) {
        this.focused = false
      }
    },
    isPreload (index) {
      let [start, end] = this.preloadRange
      return start <= end
        ? index >= start && index <= end
        : index >= start || index <= end
    }
  }
}
</script>

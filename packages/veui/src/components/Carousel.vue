<template>
<div
  class="veui-carousel"
  :ui="realUi"
>
  <div
    class="veui-carousel-viewport"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <transition-group
      name="veui-carousel-item"
      class="veui-carousel-items"
      tag="ol"
    >
      <li
        v-for="(item, i) in datasource"
        v-show="localIndex === i"
        ref="item"
        :key="`${i}`"
        :class="{
          'veui-carousel-item': true,
          'veui-carousel-item-current': localIndex === i
        }"
        tabindex="0"
      >
        <slot
          v-bind="item"
          :index="i"
        >
          <div
            class="veui-carousel-item-image"
            :style="{
              'background-image': `url(${item.src})`
            }"
          >
            <img
              class="veui-sr-only"
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
    class="veui-carousel-indicator-numbers"
  >
    {{ localIndex + 1 }}<span class="veui-carousel-indicator-numbers-separator"/>{{ count }}
  </div>
  <nav
    v-else-if="indicator !== 'none'"
    :class="{
      [`veui-carousel-indicator-${indicator}s`]: true
    }"
  >
    <button
      v-for="(item, i) in datasource"
      :key="i"
      type="button"
      :class="{
        'veui-carousel-indicator-item': true,
        'veui-carousel-indicator-item-current': localIndex === i
      }"
      @click="select(i, 'click')"
      @mouseenter="select(i, 'hover')"
    >
      {{ item.label || t('pageIndex', { index: i + 1 }) }}
    </button>
  </nav>
  <button
    type="button"
    class="veui-carousel-control veui-carousel-control-prev"
    :disabled="!wrap && localIndex === 0"
    @click="step(-1)"
  >
    <veui-icon
      :name="icons.prev"
      :label="t('prev')"
    />
  </button>
  <button
    type="button"
    class="veui-carousel-control veui-carousel-control-next"
    :disabled="!wrap && localIndex === count - 1"
    @click="step(1)"
  >
    <veui-icon
      :name="icons.next"
      :label="t('next')"
    />
  </button>
  <div
    class="veui-sr-only"
    aria-live="polite"
    aria-atomic="true"
  >
    {{ t('detail', { index: localIndex + 1, total: datasource.length }) }}
  </div>
</div>
</template>

<script>
import { includes } from 'lodash'
import Icon from './Icon'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'

export default {
  name: 'veui-carousel',
  components: {
    'veui-icon': Icon
  },
  mixins: [ui, i18n],
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
    wrap: Boolean
  },
  data () {
    return {
      localIndex: this.index
    }
  },
  computed: {
    count () {
      return this.datasource.length
    }
  },
  watch: {
    index (value) {
      if (this.localIndex === value) {
        return
      }
      this.localIndex = value
      this.initPlay()
    },
    interval (value) {
      this.initPlay()
    },
    localIndex (value, oldValue) {
      this.$emit('update:index', value)
      this.$emit('change', value, oldValue)
    },
    autoplay (value) {
      this.initPlay()
    }
  },
  mounted () {
    this.initPlay()
  },
  beforeDestroy () {
    this.stop()
  },
  methods: {
    step (delta) {
      this.localIndex = (this.localIndex + delta + this.count) % this.count
    },
    select (index, event) {
      if (event !== this.switchTrigger) {
        return
      }

      if (event === 'click') {
        setTimeout(() => {
          this.$refs.item[this.localIndex].focus()
        })
      }

      this.localIndex = index
    },
    initPlay () {
      this.stop()
      if (!this.autoplay) {
        return
      }
      this.__veui_carousel_timer__ = setInterval(() => {
        this.step(1)
      }, this.interval)
    },
    stop () {
      clearTimeout(this.__veui_carousel_timer__)
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
    }
  }
}
</script>

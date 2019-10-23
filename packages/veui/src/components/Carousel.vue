<template>
<div
  :class="$c('carousel')"
  :ui="realUi"
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
        v-show="localIndex === i"
        ref="item"
        :key="`${i}`"
        :class="{
          [$c('carousel-item')]: true,
          [$c('carousel-item-current')]: localIndex === i
        }"
        tabindex="0"
      >
        <slot
          v-bind="item"
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
    {{ localIndex + 1
    }}<span :class="$c('carousel-indicator-numbers-separator')"/>{{ count }}
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
        [$c('carousel-indicator-item-current')]: localIndex === i
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
    :disabled="!wrap && localIndex === 0"
    @click="step(-1)"
  >
    <veui-icon
      :name="icons.prev"
      :label="t('prev')"
    />
  </veui-button>
  <veui-button
    :ui="uiParts.control"
    :class="[$c('carousel-control'), $c('carousel-control-next')]"
    :disabled="!wrap && localIndex === count - 1"
    @click="step(1)"
  >
    <veui-icon
      :name="icons.next"
      :label="t('next')"
    />
  </veui-button>
  <div
    :class="$c('sr-only')"
    aria-live="polite"
    aria-atomic="true"
  >
    {{ t('detail', { index: localIndex + 1, total: datasource.length }) }}
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

export default {
  name: 'veui-carousel',
  components: {
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [prefix, ui, i18n],
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

<template>
<div class="veui-carousel" :ui="ui">
  <div class="veui-carousel-viewport" @mouseenter="handleEnter" @mouseleave="handleLeave">
  <transition-group name="veui-carousel-item" class="veui-carousel-items" tag="ol">
    <li v-for="(item, i) in datasource" v-show="localIndex === i" :key="i"
      :class="{
        'veui-carousel-item': true,
        'veui-carousel-item-current': localIndex === i
      }"
      :style="{
        'background-image': `url(${item.src})`
      }">
      <slot v-bind="item" :index="i">
        <img class="veui-sr-only" :src="item.src" :alt="item.alt">
      </slot>
    </li>
  </transition-group>
  <div v-if="indicator === 'number'" class="veui-carousel-indicator-numbers">{{ localIndex + 1 }}<span class="veui-carousel-indicator-numbers-separator"></span>{{ count }}</div>
    <nav v-else-if="indicator !== 'none'" :class="{
        [`veui-carousel-indicator-${indicator}s`]: true
      }">
      <button type="button" v-for="(item, i) in datasource" :key="i"
        :class="{
          'veui-carousel-indicator-item': true,
          'veui-carousel-indicator-item-current': localIndex === i
        }"
        @click="select(i, 'click')"
        @mouseenter="select(i, 'hover')"
      >{{ item.label || `第 ${i + 1} 页` }}</button>
    </nav>
    <button type="button" class="veui-carousel-control veui-carousel-control-prev"
      @click="step(-1)"
      :disabled="!wrap && localIndex === 0">
      <veui-icon :name="icons.prev" label="上一页"/>
    </button>
    <button type="button" class="veui-carousel-control veui-carousel-control-next"
      @click="step(1)"
      :disabled="!wrap && localIndex === count - 1">
      <veui-icon :name="icons.next" label="下一页"/>
    </button>
  </div>
  <div class="veui-sr-only" aria-live="polite" aria-atomic="true">当前是第 {{ localIndex + 1 }} 页，共 {{ datasource.length }} 页</div>
</div>
</template>

<script>
import { includes } from 'lodash'
import Icon from './Icon'
import ui from '../mixins/ui'

export default {
  name: 'veui-carousel',
  mixins: [ui],
  components: {
    'veui-icon': Icon
  },
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
  methods: {
    step (delta) {
      this.localIndex = (this.localIndex + delta + this.count) % this.count
    },
    select (index, event) {
      if (event !== this.switchTrigger) {
        return
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
  },
  mounted () {
    this.initPlay()
  },
  beforeDestroy () {
    this.stop()
  }
}
</script>

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
          name="item"
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
    {{ realIndex + 1 }}/{{ count }}
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
      aria-label="item.label || t('pageIndex', { index: i + 1 })"
      @click="select(i, 'click')"
      @focus="switchTrigger === 'hover' && select(i, 'hover')"
      @mouseenter="select(i, 'hover')"
    />
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
import useControllable from '../mixins/controllable'
import carousel from '../mixins/carousel'

export default {
  name: 'veui-carousel',
  components: {
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [prefix, ui, i18n, useControllable(['index']), carousel],
  props: {
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

      this.triggerChange(index)

      if (event === 'click') {
        this.focusCurrent()
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
    }
  }
}
</script>

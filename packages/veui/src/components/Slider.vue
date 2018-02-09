<template>
<div class="veui-slider" :style="sliderStyle">
  <!-- 条 -->
  <div class="veui-slider-track" @click="handleTrackClick">
    <slot name="track"><div class="veui-slider-track-default">
      <svg :width="width" :height="4" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <line :stroke-dasharray="lineDashArray" x1="0" y1="0" :x2="width" y2="0"></line>
      </svg>
    </div></slot>
  </div>
  <!-- 块 -->
  <div class="veui-slider-trigger" v-drag:translate.x="{
    dragstart: handleTriggerDragStart,
    drag: handleTriggerDrag
  }" :style="triggerStyle">
    <slot name="trigger"><div class="veui-slider-trigger-default"></div></slot>
  </div>
</div>
</template>

<script>
import { drag } from '../directives'
import { clamp } from 'lodash'

export default {
  name: 'Slider',
  props: {
    direction: {
      type: String,
      default: 'horizontal'
    },

    // 理想情况下不传宽度，用css控制，但是涉及到监听容器宽度变换，有点复杂
    width: {
      type: Number,
      default: 280
    },
    triggerWidth: {
      type: Number,
      default: 16
    },

    value: Number,
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1
    },
    step: {
      type: Number,
      default: 0
    },
    disabled: Boolean
  },
  directives: {
    drag
  },
  data () {
    return {
      isDragging: false,
      dragInitValue: 0
    }
  },
  computed: {
    halfTriggerWidth () {
      return this.triggerWidth / 2
    },
    sliderStyle () {
      return {
        width: `${this.width}px`
      }
    },
    triggerStyle () {
      let triggerX = clamp(this.ratio * this.width, 0, this.width)
      return {
        width: `${this.triggerWidth}px`,
        left: `${-1 * this.halfTriggerWidth}px`,
        transform: `translateX(${triggerX}px)`
      }
    },
    ratio () {
      return (this.value - this.min) / (this.max - this.min)
    },
    lineDashArray () {
      if (this.step) {
        let a = this.step / (this.max - this.min) * this.width
        return [a - 1, 1].join()
      }
      return ''
    }
  },
  methods: {
    handleTrackClick ({offsetX}) {
      let ratio = offsetX / this.width
      this.updateValueByRatio(ratio)
    },
    handleTriggerDragStart () {
      this._previousRatio = this.ratio
    },
    handleTriggerDrag ({distanceX}) {
      let ratio = this._previousRatio + distanceX / this.width
      this.updateValueByRatio(ratio)
    },
    updateValueByRatio (ratio) {
      let value = clamp(this.min + (this.max - this.min) * ratio, this.min, this.max)
      if (this.step) {
        value = Math.round(value / this.step) * this.step
      }
      this.$emit('update:value', value)
    }
  }
}
</script>

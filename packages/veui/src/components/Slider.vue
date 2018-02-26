<template>
<div class="veui-slider">
  <!-- 条 -->
  <div class="veui-slider-track" @click="handleTrackClick" ref="track">
    <slot name="track"><div class="veui-slider-track-default">
      <div class="veui-slider-track-default-bg"></div>
      <div class="veui-slider-track-default-marks" v-if="stepMarks">
        <div v-for="mark in stepMarks" :key="mark" :style="{
          left: `${mark * 100}%`
        }"></div>
      </div>
      <div class="veui-slider-track-default-fg" :style="{
        width: `${ratio * 100}%`
      }"></div>
    </div></slot>
  </div>
  <!-- 块 -->
  <div class="veui-slider-thumb" ref="thumb" tabindex="0" v-numeric.x="{
    step: keyboardChangeStep,
    update: handleThumbNumericUpdage
  }"
  @mouseenter="handleThumbMouseEnter"
  @mouseleave="handleThumbMouseLeave"
  v-drag="{
    axis: 'x',
    dragstart: handleThumbDragStart,
    drag: handleThumbDrag,
    dragend: handleThumbDragEnd
  }" :style="{
    left: `${ratio * 100}%`
  }">
    <slot name="thumb"><div class="veui-slider-thumb-default"></div></slot>
  </div>
  <!-- 提示 -->
  <slot name="tip" target="thumb" :open="showTip">
    <veui-tooltip target="thumb" :open="showTip" custom ref="tip">{{
      Math.round(localValue * 100) / 100 }}</veui-tooltip>
  </slot>
</div>
</template>

<script>
import { clamp } from 'lodash'
import drag from '../directives/drag'
import numeric from '../directives/numeric'
import input from '../mixins/input'
import Tooltip from './Tooltip'

export default {
  name: 'veui-slider',
  components: {
    'veui-tooltip': Tooltip
  },
  mixins: [input],
  props: {
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
      default: 0,
      validator (val) {
        return val >= 0
      }
    },
    mark: Boolean
  },
  directives: {
    drag, numeric
  },
  data () {
    return {
      localValue: null,
      isDragging: false,
      isThumbHover: false
    }
  },
  watch: {
    value: {
      handler (val) {
        this.localValue = this.getAdjustedValue(val)
      },
      immediate: true
    },
    localValue (val) {
      if (this.$refs.tip) {
        this.$refs.tip.relocate()
      }
      if (this.value !== val) {
        this.$emit('input', val)
      }
    }
  },
  computed: {
    ratio () {
      return (this.localValue - this.min) / (this.max - this.min)
    },
    stepMarks () {
      let {min, min: val, max, step, mark} = this
      if (!step || min >= max || !mark) {
        return
      }
      let marks = []
      while (val <= max) {
        let pos = (val - min) / (max - min)
        if (pos > 0 && pos < 1) {
          marks.push(pos)
        }
        val += step
      }
      return marks
    },
    showTip () {
      return this.isDragging || this.isThumbHover
    },
    keyboardChangeStep () {
      return this.step || (this.max - this.min) / 10
    }
  },
  methods: {
    handleTrackClick ({offsetX}) {
      let trackWidth = this.$refs.track.offsetWidth
      this.updateValueByRatio(offsetX / trackWidth)
      this.$refs.thumb.focus()
    },
    handleThumbMouseEnter () {
      this.isThumbHover = true
    },
    handleThumbMouseLeave () {
      this.isThumbHover = false
    },
    handleThumbDragStart () {
      this.isDragging = true
      this.previousRatio = this.ratio
      this.trackWidth = this.$refs.track.offsetWidth
    },
    handleThumbDrag ({distanceX}) {
      let ratio = this.previousRatio + distanceX / this.trackWidth
      this.updateValueByRatio(ratio)
    },
    handleThumbDragEnd () {
      this.isDragging = false
    },
    updateValueByRatio (ratio) {
      this.localValue = this.getAdjustedValue(this.min + (this.max - this.min) * ratio)
    },
    getAdjustedValue (val) {
      val = clamp(val, this.min, this.max)
      if (this.step > 0) {
        val = Math.floor(val / this.step) * this.step
      }
      return val
    },
    handleThumbNumericUpdage (delta) {
      console.log(delta)
      this.localValue += delta
    }
  }
}
</script>

<template>
<div class="veui-slider" v-bind="attrs">
  <!-- 条 -->
  <div class="veui-slider-track" @click="handleTrackClick" ref="track">
    <slot name="track">
      <div class="veui-slider-track-default">
        <div class="veui-slider-track-default-wrapper">
          <div class="veui-slider-track-default-bg"></div>
          <div class="veui-slider-track-default-marks" v-if="stepMarks">
            <div v-for="mark in stepMarks" :key="mark" :style="{
              left: `${mark * 100}%`
            }"></div>
          </div>
          <div class="veui-slider-track-default-fg" :style="{
            width: `${ratio * 100}%`
          }"></div>
        </div>
        <!-- /veui-slider-track-default -->
      </div>
    </slot>
  </div>
  <!-- 块 -->
  <div class="veui-slider-thumb" ref="thumb" tabindex="0" v-nudge.x="{
    step: keyboardChangeStep,
    update: handleThumbNudgeUpdage
  }"
  @mouseenter="handleThumbMouseEnter"
  @mouseleave="handleThumbMouseLeave"
  @focus="handleThumbFocus"
  @blur="handleThumbBlur"
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
  <slot name="tip" target="thumb" :open="showTip" v-if="!notip">
    <veui-tooltip target="thumb" :open="showTip" custom ref="tip">
      <slot name="tip-label">{{
        // 如果是数字就处理一下精度，否则会出现很多零
        typeof value === 'number' ? Math.round(value * 100) / 100 : value
      }}</slot>
    </veui-tooltip>
  </slot>
</div>
</template>

<script>
import { clamp } from 'lodash'
import drag from '../directives/drag'
import nudge from '../directives/nudge'
import input from '../mixins/input'
import Tooltip from './Tooltip'

export default {
  name: 'veui-slider',
  components: {
    'veui-tooltip': Tooltip
  },
  mixins: [input],
  props: {
    value: true,
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
    mark: Boolean,
    notip: Boolean,

    parser: {
      type: Function,
      default: val => val
    },
    formatter: {
      type: Function,
      default: val => val
    }
  },
  directives: {
    drag, nudge
  },
  data () {
    return {
      localValue: null,
      isDragging: false,
      isThumbHover: false,
      isFocus: false
    }
  },
  watch: {
    value: {
      handler (val) {
        this.localValue = this.getAdjustedValue(this.parser(val))
      },
      immediate: true
    },
    localValue: {
      handler (val) {
        if (this.$refs.tip) {
          // 要用 nextTick，否则有 step 的 thumb 的 tip 定位到了前一个位置
          this.$nextTick(() => {
            this.$refs.tip.relocate()
          })
        }
        if (this.parser(this.value) !== val) {
          this.$emit('input', this.formatter(val))
        }
      },
      immediate: true
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
      return this.isDragging || this.isThumbHover || this.isFocus
    },
    keyboardChangeStep () {
      return this.step || (this.max - this.min) / 10
    },
    noInteractive () {
      return this.disabled || this.readonly
    },
    attrs () {
      return {
        name: this.realName,
        disabled: this.realDisabled,
        readonly: this.realReadonly,
        focus: this.isFocus
      }
    }
  },
  methods: {
    handleTrackClick ({offsetX}) {
      if (this.noInteractive) {
        return
      }
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
      if (this.noInteractive) {
        return
      }
      this.isDragging = true
      this.previousRatio = this.ratio
      this.trackWidth = this.$refs.track.offsetWidth
    },
    handleThumbDrag ({distanceX}) {
      if (this.noInteractive) {
        return
      }
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
    handleThumbNudgeUpdage (delta) {
      if (this.noInteractive) {
        return
      }
      this.localValue += delta
    },
    handleThumbFocus () {
      if (this.disabled) {
        this.$refs.thumb.blur()
        return
      }
      this.isFocus = true
    },
    handleThumbBlur () {
      this.isFocus = false
    }
  }
}
</script>

<template>
<div
  :class="sliderClasses"
  :ui="realUi"
  role="application"
  tabindex="-1"
>
  <!-- 条 -->
  <div
    ref="track"
    class="veui-slider-track"
    @click="handleTrackClick"
  >
    <slot name="track">
      <div class="veui-slider-track-default">
        <div class="veui-slider-track-default-wrapper">
          <div class="veui-slider-track-default-bg veui-slider-track-default-progress"/>
          <div
            v-if="stepMarks"
            class="veui-slider-track-default-marks"
          >
            <div
              v-for="mk in stepMarks"
              :key="mk"
              class="veui-slider-track-default-mark"
              :style="{
                left: `${mk * 100}%`
              }"
            />
          </div>
          <div
            class="veui-slider-track-default-sp veui-slider-track-default-progress"
            :style="secondardProgressStyle"
          />
          <div
            class="veui-slider-track-default-fg veui-slider-track-default-progress"
            :style="progressStyle"
          />
        </div>
      </div>
    </slot>
  </div>

  <!-- 块 -->
  <button
    v-for="(_, index) in new Array(thumbCount)"
    type="button"
    :key="`thumb${index}`"
    ref="thumb"
    v-outside.hover="() => handleThumbMouseLeave(index)"
    v-drag="thumbDragOptions[index]"
    v-nudge.x="{
      step: keyboardChangeStep,
      update: (...args) => handleThumbNudgeUpdage(index, ...args)
    }"
    class="veui-slider-thumb"
    :disabled="realDisabled"
    :style="{
      left: `${ratios[index] * 100}%`
    }"
    role="slider"
    v-bind="thumbAttrs[index]"
    @mouseenter="handleThumbMouseEnter(index)"
    @mousedown="handleThumbFocus(index)"
    @focus="handleThumbFocus(index)"
    @blur="handleThumbBlur(index)"
  >
    <slot
      name="thumb"
      :index="index"
      :focus="currentThumbFocusIndex === index"
      :hover="currentThumbHoverIndex === index"
      :dragging="currentThumbDraggingIndex === index"
    >
      <div class="veui-slider-thumb-default"/>
    </slot>
  </button>

  <!-- 提示 -->
  <slot
    name="tip"
    :target="tooltipTarget"
    :open="activeTooltipIndex >= 0"
    :activeIndex="activeTooltipIndex"
  >
    <veui-tooltip
      ref="tip"
      :target="tooltipTarget"
      :open="activeTooltipIndex >= 0"
      trigger="custom"
      :interactive="false"
    >
      <slot name="tip-label">
        {{ tooltipLabel }}
      </slot>
    </veui-tooltip>
  </slot>
</div>
</template>

<script>
import { fill, clamp, isEqual, identity } from 'lodash'
import drag from '../directives/drag'
import nudge from '../directives/nudge'
import outside from '../directives/outside'
import ui from '../mixins/ui'
import input from '../mixins/input'
import Tooltip from './Tooltip'

export default {
  name: 'veui-slider',
  components: {
    'veui-tooltip': Tooltip
  },
  directives: {
    drag,
    nudge,
    outside
  },
  mixins: [ui, input],
  props: {
    /* eslint-disable vue/require-prop-types */
    value: {},
    /* eslint-enable vue/require-prop-types */
    secondaryProgress: {
      type: [Number, Array],
      default: 0
    },

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
      validator: val => val >= 0
    },
    mark: Boolean,
    parse: {
      type: Function,
      default: identity
    },
    format: {
      type: Function,
      default: identity
    }
  },
  data () {
    return {
      localValues: [],

      currentThumbFocusIndex: -1,
      currentThumbDraggingIndex: -1,
      currentThumbHoverIndex: -1,
      latestIndex: -1,

      thumbCount: 0
    }
  },
  computed: {
    sliderClasses () {
      return {
        'veui-slider': true,
        'veui-disabled': this.realDisabled,
        'veui-readonly': this.realReadonly
      }
    },
    ratios () {
      let { min, max } = this
      return this.localValues.map(val => (val - min) / (max - min))
    },
    activeTooltipIndex () {
      if (this.currentThumbFocusIndex >= 0) {
        return this.currentThumbFocusIndex
      }
      if (this.currentThumbHoverIndex >= 0) {
        return this.currentThumbHoverIndex
      }
      return -1
    },
    tooltipTarget () {
      return this.getThumbRefByIndex(this.activeTooltipIndex)
    },
    tooltipLabel () {
      return this.getValueByIndex(this.latestIndex)
    },
    stepMarks () {
      let { min, min: val, max, step, mark } = this
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
    keyboardChangeStep () {
      // 如果没有指定 step ，就算一个
      return this.step || (this.max - this.min) / 10
    },
    noInteractive () {
      return this.realDisabled || this.realReadonly
    },
    localValueBoundary () {
      return this.getLocalValueBoundary(this.currentThumbFocusIndex)
    },
    progressStyle () {
      return this.getProgressStyle(this.ratios)
    },

    localSecondaryProgress () {
      let { min, max } = this
      return []
        .concat(this.secondaryProgress)
        .map(progress => (progress - min) / (max - min))
    },
    secondardProgressStyle () {
      return this.getProgressStyle(this.localSecondaryProgress)
    },
    thumbAttrs () {
      return this.localValues.map((value, index) => {
        let { min, max } = this.getLocalValueBoundary(index)
        return {
          'aria-valuemin': this.reduceDecimal(min),
          'aria-valuemax': this.reduceDecimal(max),
          'aria-valuenow': this.reduceDecimal(value),
          'aria-valuetext': this.format(this.reduceDecimal(value))
        }
      })
    },
    thumbDragOptions () {
      return fill(new Array(this.thumbCount), true).map((_, index) => ({
        axis: 'x',
        dragstart: (...args) => this.handleThumbDragStart(index, ...args),
        drag: (...args) => this.handleThumbDrag(index, ...args),
        dragend: (...args) => this.handleThumbDragEnd(index, ...args)
      }))
    }
  },
  watch: {
    value: {
      handler (val) {
        this.localValues = []
          .concat(val)
          .map(val => this.getAdjustedValue(this.parse(val)))
          .sort((a, b) => (a > b ? 1 : -1))
      },
      immediate: true
    },
    localValues: {
      handler (newVal, oldVal = []) {
        if (newVal.length !== oldVal.length) {
          // 解耦 localValue 和 localValue.length，防止依赖 localValue 长度的 drag options 在拖动时改变
          this.thumbCount = newVal.length
        }

        if (this.$refs.tip) {
          // 要用 nextTick，否则有 step 的 thumb 的 tip 定位到了前一个位置
          this.$nextTick(() => {
            this.$refs.tip.relocate()
          })
        }

        let value = [].concat(this.value).map(val => this.parse(val))
        if (!isEqual(value, newVal)) {
          newVal = newVal.map(this.format)
          this.$emit('input', newVal.length > 1 ? newVal : newVal[0])
        }
      },
      immediate: true
    },
    activeTooltipIndex: {
      handler (val) {
        if (val !== -1) {
          this.latestIndex = val
        }
      },
      immediate: true
    }
  },
  methods: {
    handleTrackClick ({ offsetX }) {
      if (this.noInteractive || this.localValues.length > 1) {
        return
      }
      let trackWidth = this.$refs.track.offsetWidth
      this.updateValueByRatio(offsetX / trackWidth)
      this.$refs.thumb[0].focus()
    },
    handleThumbMouseEnter (index) {
      this.currentThumbHoverIndex = index
    },
    handleThumbMouseLeave (index) {
      this.currentThumbHoverIndex = -1
    },
    handleThumbDragStart (index) {
      if (this.noInteractive) {
        return
      }
      this.currentThumbDraggingIndex = index
      this.previousRatio = this.ratios[index]
      this.trackWidth = this.$refs.track.offsetWidth
    },
    handleThumbDrag (index, { distanceX }) {
      if (this.noInteractive) {
        return
      }
      let ratio = this.previousRatio + distanceX / this.trackWidth
      this.updateValueByRatio(ratio, index)
    },
    handleThumbDragEnd (index) {
      this.currentThumbDraggingIndex = -1
    },
    handleThumbNudgeUpdage (index, delta) {
      if (this.noInteractive) {
        return
      }
      let { min, max } = this.localValueBoundary
      let val = this.getAdjustedValue(this.localValues[index] + delta, min, max)
      this.$set(this.localValues, index, val)
    },
    handleThumbFocus (index) {
      this.currentThumbFocusIndex = index
    },
    handleThumbBlur (index) {
      this.currentThumbFocusIndex = -1
    },
    updateValueByRatio (ratio, index = 0) {
      let { min, max } = this.localValueBoundary
      let val = this.getAdjustedValue(
        this.min + (this.max - this.min) * ratio,
        min,
        max
      )
      this.$set(this.localValues, index, val)
    },
    getAdjustedValue (val, min = this.min, max = this.max) {
      val = clamp(val, min, max)
      if (this.step > 0) {
        let maxSteps = Math.floor((max - min) / this.step)
        val =
          Math.min(Math.round((val - min) / this.step), maxSteps) * this.step +
          min
      }
      return val
    },
    getValueByIndex (index) {
      let val = Array.isArray(this.value) ? this.value[index] : this.value
      return this.reduceDecimal(val)
    },
    reduceDecimal (val) {
      // 如果是数字就处理一下精度，否则会出现很多零
      return typeof val === 'number' ? Math.round(val * 100) / 100 : val
    },
    getThumbRefByIndex (index) {
      return this.$refs.thumb && this.$refs.thumb[index]
    },
    getLocalValueBoundary (thumbIndex) {
      let { min, max, ratios } = this
      let len = this.localValues.length
      if (len === 1) {
        return { min, max }
      }
      let prevIndex = thumbIndex - 1
      let nextIndex = thumbIndex + 1
      let minLocalValue =
        prevIndex < 0 ? min : ratios[prevIndex] * (max - min) + min
      let maxLocalValue =
        nextIndex > len - 1 ? max : ratios[nextIndex] * (max - min) + min
      return {
        min: minLocalValue,
        max: maxLocalValue
      }
    },
    getProgressStyle (ratios) {
      let left = 0
      let width
      if (ratios.length === 1) {
        width = `${ratios[0] * 100}%`
      } else {
        left = `${ratios[0] * 100}%`
        width = `${(ratios[ratios.length - 1] - ratios[0]) * 100}%`
      }
      return {
        left,
        width
      }
    },
    focus () {
      this.$el.focus()
    }
  }
}
</script>

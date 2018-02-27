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
          <div class="veui-slider-track-default-fg" :style="progressStyle"></div>
        </div>
      </div>
    </slot>
  </div>

  <!-- 块 -->
  <div v-for="(localValue, index) in localValues" :key="`thumb${index}`"
    class="veui-slider-thumb" ref="thumb" tabindex="0"
    :style="{
      left: `${ratios[index] * 100}%`
    }"
    @mouseenter="handleThumbMouseEnter(index, $event)"
    @mouseleave="handleThumbMouseLeave(index, $event)"
    @focus="handleThumbFocus(index, $event)"
    @blur="handleThumbBlur(index, $event)"
    v-nudge.x="{
      step: keyboardChangeStep,
      update: (...args) => handleThumbNudgeUpdage(index, ...args)
    }"
    v-drag="{
      axis: 'x',
      dragstart: (...args) => handleThumbDragStart(index, ...args),
      drag: (...args) => handleThumbDrag(index, ...args),
      dragend: (...args) => handleThumbDragEnd(index, ...args)
    }">
    <slot name="thumb" :index="index" :focus="isThumbFocus[index]"
      :hover="isThumbHover[index]" :dragging="isThumbDragging[index]">
      <div class="veui-slider-thumb-default"></div>
    </slot>
  </div>

  <!-- 提示 -->
  <!-- <template v-for="(localValue, index) in localValues" v-if="!notip"> -->
    <slot name="tip" :target="tooltipTarget" :open="showTips[currentIndex]">
      <veui-tooltip :target="tooltipTarget" :open="showTips[currentIndex]" custom ref="tip">
        <slot name="tip-label">{{ getValue(currentIndex) }}</slot>
      </veui-tooltip>
    </slot>
  <!-- </template> -->

</div>
</template>

<script>
import { clamp, isArray, isEqual } from 'lodash'
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
      validator: val => val >= 0
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
      localValues: [],

      isThumbDragging: [],
      isThumbHover: [],
      isThumbFocus: [],

      currentIndex: -1
    }
  },
  watch: {
    value: {
      handler (val) {
        this.localValues = [].concat(val).map(val => this.getAdjustedValue(this.parser(val)))
      },
      immediate: true
    },
    localValues: {
      handler (localValues) {
        if (this.$refs.tip) {
          // 要用 nextTick，否则有 step 的 thumb 的 tip 定位到了前一个位置
          this.$nextTick(() => {
            // this.$refs.tip.forEach(tip => tip.relocate())
            this.$refs.tip.relocate()
          })
        }
        let value = [].concat(this.value).map(val => this.parser(val))
        if (!isEqual(value, localValues)) {
          this.$emit('input', this.formatter(localValues.length > 1 ? localValues : localValues[0]))
        }
      },
      immediate: true
    }
  },
  computed: {
    ratios () {
      let {min, max} = this
      return this.localValues.map(val => (val - min) / (max - min))
    },
    showTips () {
      return this.localValues.map((val, index) => (
        this.isThumbDragging[index] || this.isThumbHover[index] || this.isThumbFocus[index]
      ))
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
        readonly: this.realReadonly
      }
    },
    progressStyle () {
      let left = 0
      let width
      if (this.ratios.length === 1) {
        width = `${this.ratios[0] * 100}%`
      } else {
        let ratios = this.ratios.sort((a, b) => a > b ? 1 : -1)
        left = `${ratios[0] * 100}%`
        width = `${(ratios[ratios.length - 1] - ratios[0]) * 100}%`
      }
      return {
        left,
        width
      }
    },
    tooltipTarget () {
      return this.currentIndex >= 0 && this.$refs.thumb && this.$refs.thumb[this.currentIndex]
    }
  },
  methods: {
    handleTrackClick ({offsetX}) {
      if (this.noInteractive || this.localValues.length > 1) {
        return
      }
      let trackWidth = this.$refs.track.offsetWidth
      this.updateValueByRatio(offsetX / trackWidth)
      this.$refs.thumb[0].focus()
    },

    handleThumbMouseEnter (index) {
      this.$set(this.isThumbHover, index, true)
    },
    handleThumbMouseLeave (index) {
      this.$set(this.isThumbHover, index, false)
    },
    handleThumbDragStart (index) {
      if (this.noInteractive) {
        return
      }
      this.currentIndex = index
      this.$set(this.isThumbDragging, index, true)
      this.previousRatio = this.ratios[index]
      this.trackWidth = this.$refs.track.offsetWidth
    },
    handleThumbDrag (index, {distanceX}) {
      if (this.noInteractive) {
        return
      }
      let ratio = this.previousRatio + distanceX / this.trackWidth
      this.updateValueByRatio(ratio, index)
    },
    handleThumbDragEnd (index) {
      this.currentIndex = -1
      this.$set(this.isThumbDragging, index, false)
    },
    handleThumbNudgeUpdage (index, delta) {
      if (this.noInteractive) {
        return
      }
      this.$set(this.localValues, index, this.localValues[index] + delta)
    },
    handleThumbFocus (index) {
      if (this.disabled) {
        this.$refs.thumb[index].blur()
        return
      }
      this.$set(this.isThumbFocus, index, true)
      this.currentIndex = index
    },
    handleThumbBlur (index) {
      this.$set(this.isThumbFocus, index, false)
      this.currentIndex = -1
    },

    updateValueByRatio (ratio, index = 0) {
      let val = this.getAdjustedValue(this.min + (this.max - this.min) * ratio)
      this.$set(this.localValues, index, val)
    },
    getAdjustedValue (val) {
      val = clamp(val, this.min, this.max)
      if (this.step > 0) {
        val = Math.floor(val / this.step) * this.step
      }
      return val
    },

    getValue (index) {
      let val = isArray(this.value) ? this.value[index] : this.value
      // 如果是数字就处理一下精度，否则会出现很多零
      return typeof val === 'number' ? Math.round(val * 100) / 100 : val
    }
  }
}
</script>

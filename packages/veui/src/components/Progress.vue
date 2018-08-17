<template>
<div
  class="veui-progress"
  role="progressbar"
  :aria-valuemax="max"
  :aria-valuemin="min"
  :aria-valuenow="realValue"
  :aria-valuetext="desc ? valueText : null"
  :class="klass"
  :ui="ui">
  <div v-if="desc" class="veui-progress-desc">
    <slot v-bind="{ percent, value: realValue, status }">
      <veui-icon :name="icons.success" v-if="type === 'circular' && localStatus === 'success'"/>
      <span class="veui-progress-desc-text">{{ valueText }}</span>
    </slot>
  </div>
  <div v-if="type === 'bar'" class="veui-progress-rail">
    <div class="veui-progress-meter" :style="{
      transform: `translateX(${percent}%)`
    }"></div>
  </div>
  <svg v-else-if="type === 'circular'" class="veui-progress-circle"
    :width="(radius + halfStroke) * 2" :height="(radius + halfStroke) * 2">
    <circle class="veui-progress-rail" :cx="radius + halfStroke" :cy="radius + halfStroke" :r="radius" fill="none" :stroke-width="stroke"></circle>
    <circle class="veui-progress-meter" :cx="radius + halfStroke" :cy="radius + halfStroke" :r="radius" fill="none" :stroke-width="stroke"
      :stroke-dasharray="circumference | fixed" :stroke-dashoffset="circumference * (1 - ratio) | fixed"></circle>
  </svg>
</div>
</template>

<script>
import ui from '../mixins/ui'
import Icon from './Icon'
import warn from '../utils/warn'
import { clamp } from 'lodash'

const RADIUS_DEFAULT = 60
const STROKE_DEFAULT = 2

export default {
  name: 'veui-progress',
  mixins: [ui],
  components: {
    'veui-icon': Icon
  },
  filters: {
    fixed (val) {
      return Math.round(val * 100) / 100
    }
  },
  props: {
    type: {
      type: String,
      default: 'bar'
    },
    indeterminate: Boolean,
    desc: Boolean,
    value: {
      type: Number,
      default: 0
    },
    /**
     * @deprecated
     */
    precision: {
      type: Number,
      default: 0,
      validator (val) {
        if (val !== 0) {
          warn('[veui-progress] `precision` is deprecated and will be removed in `1.0.0`. Use `decimal-place` instead.')
        }
        return true
      }
    },
    decimalPlace: {
      type: Number
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1
    },
    status: String,
    /**
     * @deprecated
     */
    state: {
      type: String,
      validator (val) {
        if (val != null) {
          warn('[veui-progress] `state` is deprecated and will be removed in `1.0.0`. Use `status` instead.')
        }
        return true
      }
    },
    autoSucceed: [Boolean, Number]
  },
  data () {
    return {
      localStatus: this.status || this.state
    }
  },
  computed: {
    realValue () {
      return clamp(this.value, this.min, this.max)
    },
    klass () {
      return {
        'veui-progress-status-complete': this.realValue === this.max,
        [`veui-progress-${this.type}`]: true,
        ...this.localStatus
          ? { [`veui-progress-status-${this.localStatus}`]: true }
          : {},
        ...this.indeterminate
          ? { 'veui-progress-indeterminate': true }
          : {}
      }
    },
    ratio () {
      return (this.realValue - this.min) / (this.max - this.min)
    },
    percent () {
      return this.ratio * 100
    },
    circumference () {
      return 2 * Math.PI * this.radius
    },
    radius () {
      return this.uiData.radius || RADIUS_DEFAULT
    },
    stroke () {
      return this.uiData.stroke || STROKE_DEFAULT
    },
    halfStroke () {
      return this.stroke / 2
    },
    dm () {
      return (this.decimalPlace != null ? this.decimalPlace : this.precision) || 0
    },
    valueText () {
      if (this.localStatus === 'success') {
        return '完成'
      } else if (this.localStatus === 'alert') {
        return '错误'
      } else {
        return this.percent.toFixed(this.decimalPlace) + '%'
      }
    }
  },
  watch: {
    realValue (val) {
      if (this.status && this.status !== 'success') {
        return
      }

      if (this.status === 'success' && val < this.max) {
        this.setStatus(null)
        return
      }

      if (this.autoSucceed != null) {
        if (this.autoSucceed === true || this.autoSucceed === 0) {
          this.setStatus(val === this.max ? 'success' : null)
          return
        } else if (this.autoSucceed === false) {
          return
        }
        this.timer = setTimeout(() => {
          this.setStatus(val === this.max ? 'success' : null)
        }, this.autoSucceed)
      }
    },
    status (val) {
      this.localStatus = val
    }
  },
  methods: {
    setStatus (status) {
      this.localStatus = status
      this.$emit('update:status', status)
      this.$emit('update:state', status)
    }
  },
  created () {
    if (this.max <= this.min) {
      warn('[veui-progress] `max` must be larger than `min`.')
    }
  },
  destroy () {
    clearTimeout(this.timer)
  }
}
</script>

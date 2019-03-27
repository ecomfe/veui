<template>
<div
  class="veui-progress"
  role="progressbar"
  :aria-valuemax="max"
  :aria-valuemin="min"
  :aria-valuenow="realValue"
  :aria-valuetext="desc ? valueText : null"
  :class="klass"
  :ui="realUi"
>
  <div
    v-if="desc"
    class="veui-progress-desc"
  >
    <slot v-bind="{ percent, value: realValue, status }">
      <veui-icon
        v-if="type === 'circular' && localStatus === 'success'"
        :name="icons.success"
      />
      <span class="veui-progress-desc-text">
        {{ valueText }}
      </span>
    </slot>
  </div>
  <div
    v-if="type === 'bar'"
    class="veui-progress-rail"
  >
    <div
      class="veui-progress-meter"
      :style="{
        transform: indeterminate ? null : `translateX(${percent}%)`
      }"
    />
  </div>
  <svg
    v-else-if="type === 'circular'"
    class="veui-progress-circle"
    :width="width"
    :height="width"
    :viewBox="`0 0 ${width} ${width}`"
  >
    <circle
      class="veui-progress-rail"
      :cx="halfWidth"
      :cy="halfWidth"
      :r="getLength(radius)"
      fill="none"
      :stroke-width="getLength(stroke)"
    />
    <circle
      class="veui-progress-meter"
      :cx="halfWidth"
      :cy="halfWidth"
      :r="getLength(radius)"
      fill="none"
      :stroke-width="getLength(stroke)"
      :stroke-dasharray="getLength(circumference)"
      :stroke-dashoffset="getLength(circumference * (1 - ratio))"
      :stroke-linecap="strokeLinecap"
    />
  </svg>
</div>
</template>

<script>
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import Icon from './Icon'
import warn from '../utils/warn'
import { clamp } from 'lodash'

const RADIUS_DEFAULT = 60
const STROKE_DEFAULT = 2
const STROKE_LINECAP = null

export default {
  name: 'veui-progress',
  components: {
    'veui-icon': Icon
  },
  mixins: [ui, i18n],
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
          warn(
            '[veui-progress] `precision` is deprecated and will be removed in `1.0.0`. Use `decimal-place` instead.',
            this
          )
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
          warn(
            '[veui-progress] `state` is deprecated and will be removed in `1.0.0`. Use `status` instead.',
            this
          )
        }
        return true
      }
    },
    autosucceed: [Boolean, Number],
    /**
     * @deprecated
     */
    autoSucceed: {
      validator (val) {
        if (val != null) {
          warn(
            '[veui-progress] `auto-succeed` is deprecated and will be removed in `1.0.0`. Use `autosucceed` instead.',
            this
          )
        }
        return true
      }
    }
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
    realAutosucceed () {
      return this.autosucceed != null ? this.autosucceed : this.autoSucceed
    },
    klass () {
      return {
        'veui-progress-status-complete': this.realValue === this.max,
        'veui-progress-has-desc': this.desc,
        [`veui-progress-${this.type}`]: true,
        ...(this.localStatus
          ? { [`veui-progress-status-${this.localStatus}`]: true }
          : {}),
        ...(this.indeterminate ? { 'veui-progress-indeterminate': true } : {})
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
    strokeLinecap () {
      return this.uiData.strokeLinecap || STROKE_LINECAP
    },
    width () {
      return this.halfWidth * 2
    },
    halfWidth () {
      return this.getLength(this.radius + this.halfStroke)
    },
    dm () {
      return (
        (this.decimalPlace != null ? this.decimalPlace : this.precision) || 0
      )
    },
    valueText () {
      if (this.localStatus === 'success') {
        return this.t('done')
      } else if (this.localStatus === 'alert') {
        return this.t('error')
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

      if (this.realAutosucceed != null) {
        if (this.realAutosucceed === true || this.realAutosucceed === 0) {
          this.setStatus(val === this.max ? 'success' : null)
          return
        } else if (this.realAutosucceed === false) {
          return
        }
        this.timer = setTimeout(() => {
          this.setStatus(val === this.max ? 'success' : null)
        }, this.realAutosucceed)
      }
    },
    status (val) {
      this.localStatus = val
    }
  },
  created () {
    if (this.max <= this.min) {
      warn('[veui-progress] `max` must be larger than `min`.', this)
    }
  },
  methods: {
    setStatus (status) {
      this.localStatus = status
      this.$emit('update:status', status)
      this.$emit('update:state', status)
    },
    getLength (val) {
      return `${Math.round(val * 100) / 100}`
    }
  },
  destroy () {
    clearTimeout(this.timer)
  }
}
</script>

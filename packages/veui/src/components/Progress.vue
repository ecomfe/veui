<template>
<div
  role="progressbar"
  :aria-valuemax="max"
  :aria-valuemin="min"
  :aria-valuenow="realValue"
  :aria-valuetext="desc ? valueText : null"
  :aria-describedby="descId"
  :class="klass"
  :ui="realUi"
>
  <div
    v-if="type === 'bar'"
    :class="$c('progress-rail')"
    aria-hidden="true"
  >
    <div
      :class="$c('progress-meter')"
      :style="{
        transform: indeterminate ? null : `translateX(${percent}%)`
      }"
    />
  </div>
  <svg
    v-else-if="type === 'circular'"
    :class="$c('progress-circle')"
    aria-hidden="true"
    :width="width"
    :height="width"
    :viewBox="`0 0 ${width} ${width}`"
  >
    <circle
      :class="$c('progress-rail')"
      :cx="halfWidth"
      :cy="halfWidth"
      :r="getLength(realRadius)"
      fill="none"
      :stroke-width="getLength(realStroke)"
    />
    <circle
      :class="$c('progress-meter')"
      :cx="halfWidth"
      :cy="halfWidth"
      :r="getLength(realRadius)"
      fill="none"
      :stroke-width="getLength(realStroke)"
      :stroke-dasharray="getLength(circumference)"
      :stroke-dashoffset="getLength(circumference * (1 - ratio))"
      :stroke-linecap="strokeLinecap"
    />
  </svg>
  <div
    v-if="desc"
    :id="descId"
    :class="$c('progress-desc')"
  >
    <slot v-bind="{ percent, value: realValue, status }">
      <veui-icon
        v-if="realStatus"
        :class="$c('progress-status-icon')"
        :name="icons[type === 'bar' ? `${realStatus}Bar` : realStatus]"
      />
      <template v-else>{{ valueText }}</template>
      <slot
        name="after"
        v-bind="{ percent, value: realValue, status }"
      />
    </slot>
  </div>
</div>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import Icon from './Icon'
import warn from '../utils/warn'
import { uniqueId, clamp } from 'lodash'
import useControllable from '../mixins/controllable'

const RADIUS_DEFAULT = 60
const STROKE_DEFAULT = 2
const STROKE_LINECAP = null

export default {
  name: 'veui-progress',
  components: {
    'veui-icon': Icon
  },
  mixins: [prefix, ui, useControllable('status')],
  props: {
    type: {
      type: String,
      default: 'bar'
    },
    radius: Number,
    strokeWidth: Number,
    indeterminate: Boolean,
    desc: Boolean,
    value: {
      type: Number,
      default: 0
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
    autosucceed: [Boolean, Number]
  },
  data () {
    return {
      descId: uniqueId('veui-progress-')
    }
  },
  computed: {
    realValue () {
      return clamp(this.value, this.min, this.max)
    },
    klass () {
      return {
        [this.$c('progress')]: true,
        [this.$c('progress-status-complete')]: this.realValue === this.max,
        [this.$c('progress-has-desc')]: this.desc,
        [this.$c(`progress-${this.type}`)]: true,
        ...(this.realStatus
          ? { [this.$c(`progress-status-${this.realStatus}`)]: true }
          : {}),
        ...(this.indeterminate
          ? { [this.$c('progress-indeterminate')]: true }
          : {})
      }
    },
    ratio () {
      return (this.realValue - this.min) / (this.max - this.min)
    },
    percent () {
      return this.ratio * 100
    },
    realRadius () {
      return this.radius || this.uiData.radius || RADIUS_DEFAULT
    },
    realStroke () {
      return this.strokeWidth || this.uiData.strokeWidth || STROKE_DEFAULT
    },
    halfStroke () {
      return this.realStroke / 2
    },
    strokeLinecap () {
      return this.uiData.strokeLinecap || STROKE_LINECAP
    },
    circumference () {
      return 2 * Math.PI * this.realRadius
    },
    width () {
      return this.halfWidth * 2
    },
    halfWidth () {
      return this.getLength(this.realRadius + this.halfStroke)
    },
    valueText () {
      return this.percent.toFixed(this.decimalPlace) + '%'
    }
  },
  watch: {
    realValue (val) {
      if (this.status && this.status !== 'success') {
        return
      }

      if (this.status === 'success' && val < this.max) {
        this.commit('status', null)
        return
      }

      if (this.autosucceed != null) {
        if (this.autosucceed === true || this.autosucceed === 0) {
          this.commit('status', val === this.max ? 'success' : null)
          return
        } else if (this.autosucceed === false) {
          return
        }
        this.timer = setTimeout(() => {
          this.commit('status', val === this.max ? 'success' : null)
        }, this.autosucceed)
      }
    }
  },
  created () {
    if (this.max <= this.min) {
      warn('[veui-progress] `max` must be larger than `min`.', this)
    }
  },
  methods: {
    getLength (val) {
      return `${Math.round(val * 100) / 100}`
    }
  },
  destroy () {
    clearTimeout(this.timer)
  }
}
</script>

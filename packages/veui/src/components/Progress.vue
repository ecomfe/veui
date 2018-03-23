<template>
<div class="veui-progress" :class="klass" :ui="ui">
  <div v-if="type === 'bar'" class="veui-progress-rail">
    <div class="veui-progress-meter" :style="{
      transform: `translateX(${percent}%)`
    }"></div>
  </div>
  <svg v-else-if="type === 'circular'" class="veui-progress-circle"
    :width="(radius + halfStroke) * 2" :height="(radius + halfStroke) * 2">
    <circle class="veui-progress-rail" :cx="radius + halfStroke" :cy="radius + halfStroke" :r="radius" fill="none" :stroke-width="stroke"></circle>
    <circle class="veui-progress-meter" :cx="radius + halfStroke" :cy="radius + halfStroke" :r="radius" fill="none" :stroke-width="stroke"
      :stroke-dasharray="circumference" :stroke-dashoffset="circumference * (1 - ratio)"></circle>
  </svg>
  <div v-if="desc" class="veui-progress-desc">
    <slot v-bind="{ percent, value, state }">
      <veui-icon :name="icons.success" v-if="type === 'circular' && localState === 'success'"/>
      <span class="veui-progress-desc-text">
        <template v-if="localState === 'success'">完成</template>
        <template v-else-if="localState === 'alert'">错误</template>
        <template v-else>{{ percent.toFixed(precision) }}%</template>
      </span>
    </slot>
  </div>
</div>
</template>

<script>
import ui from '../mixins/ui'
import Icon from './Icon'

const RADIUS_DEFAULT = 60
const STROKE_DEFAULT = 2

export default {
  name: 'veui-progress',
  mixins: [ui],
  components: {
    'veui-icon': Icon
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
    precision: {
      type: Number,
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
    state: String,
    autoSucceed: [Boolean, Number]
  },
  data () {
    return {
      localState: this.state
    }
  },
  computed: {
    klass () {
      return {
        'veui-progress-state-complete': this.value === this.max,
        [`veui-progress-${this.type}`]: true,
        ...this.localState
          ? { [`veui-progress-state-${this.localState}`]: true }
          : {},
        ...this.indeterminate
          ? { 'veui-progress-indeterminate': true }
          : {}
      }
    },
    ratio () {
      return (this.value - this.min) / (this.max - this.min)
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
    }
  },
  watch: {
    value (val) {
      if (this.state && this.state !== 'success') {
        return
      }
      if (this.autoSucceed != null) {
        if (this.autoSucceed === true) {
          this.setState(val === this.max ? 'success' : null)
          return
        }

        this.timer = setTimeout(() => {
          this.setState(val === this.max ? 'success' : null)
        }, this.autoSucceed)
      }
    },
    state (val) {
      this.localState = val
    }
  },
  methods: {
    setState (state) {
      this.localState = state
      this.$emit('update:state', state)
    }
  },
  destroy () {
    clearTimeout(this.timer)
  }
}
</script>

<template>
<div class="veui-progress" :class="clazz" :ui="ui">
  <div v-if="type === 'bar'" class="veui-progress-rail">
    <div class="veui-progress-meter" :style="{
      transform: `translateX(${percent}%)`
    }"></div>
  </div>
  <svg v-else-if="type === 'circular'" class="veui-progress-circle"
    :width="(radius + 1) * 2" :height="(radius + 1) * 2">
    <circle class="veui-progress-rail" :cx="radius + 1" :cy="radius + 1" :r="radius" fill="none" stroke-width="2"></circle>
    <circle class="veui-progress-meter" :cx="radius + 1" :cy="radius + 1" :r="radius" fill="none" stroke-width="2"
      :stroke-dasharray="circumference" :stroke-dashoffset="circumference * (1 - ratio)"></circle>
  </svg>
  <div v-if="desc" class="veui-progress-desc">
    <slot v-bind="{ percent, value, state }">
      <veui-icon :name="icons.success" v-if="type === 'circular' && localState === 'success'"></veui-icon>
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
import { ui, icons } from '../mixins'
import { includes } from 'lodash'
import Icon from './Icon'

const RADIUS_NORMAL = 60
const RADIUS_TINY = 13

export default {
  name: 'veui-progress',
  mixins: [ui, icons],
  components: {
    'veui-icon': Icon
  },
  props: {
    ui: String,
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
    clazz () {
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
      return includes(this.uiProps, 'tiny') ? RADIUS_TINY : RADIUS_NORMAL
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

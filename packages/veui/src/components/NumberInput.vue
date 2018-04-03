<template>
  <veui-input v-nudge.y="{
      step,
      update: handleThumbNudgeUpdate
    }"
    :ui="ui"
    type="text"
    v-model="localValue"
    v-on="listeners"
    v-bind="attrs"
    @blur="handleBlur"
    :class="{
      'veui-number-input': true,
      'veui-readonly': realReadonly,
      'veui-disabled': realDisabled
    }"
  >
    <template slot="before">
      <slot name="before"></slot>
    </template>
    <template slot="after">
      <veui-button
        class="veui-number-input-step-up"
        @click="handleStep(1)"
        :disabled="realReadonly || realDisabled"
      >
        <veui-icon :name="icons.increase"></veui-icon>
      </veui-button>
      <veui-button
        class="veui-number-input-step-down"
        @click="handleStep(-1)"
        :disabled="realReadonly || realDisabled"
      >
        <veui-icon :name="icons.decrease"></veui-icon>
      </veui-button>
      <slot name="after"></slot>
    </template>
  </veui-input>
</template>

<script>
import Input from './Input'
import Button from './Button'
import ui from '../mixins/ui'
import input from '../mixins/input'
import Icon from './Icon'
import { getListeners } from '../utils/helper'
import { add, round, truncDecimal } from '../utils/math'
import { isInteger, isNaN } from 'lodash'
import nudge from 'veui/directives/nudge'

const EVENTS = ['focus', 'click', 'keyup', 'keypress']

export default {
  name: 'veui-number-input',
  mixins: [input, ui],
  directives: {
    nudge
  },
  components: {
    'veui-icon': Icon,
    'veui-input': Input,
    'veui-button': Button
  },
  props: {
    ui: String,
    value: Number,
    step: {
      type: Number,
      default: 1
    },
    decimalPlace: {
      type: Number,
      default: 0,
      validator (val) {
        return val >= 0 && val <= 100 && isInteger(val)
      }
    }
  },
  data () {
    return {
      localValue: this.value
    }
  },
  watch: {
    localValue (val) {
      if (val == null) {
        this.$emit('input', null)
        return
      }

      val = parseFloat(val)
      if (val !== parseFloat(this.value)) {
        this.$emit('input', isNaN(val) ? null : +this.calcDisplayValue(val))
      }
    },
    value (val) {
      if (val == null) {
        this.localValue = null
        return
      }

      if (parseFloat(val) !== parseFloat(this.value)) {
        this.localValue = this.calcDisplayValue(val)
      }
    }
  },
  computed: {
    listeners () {
      return getListeners(EVENTS, this)
    },
    attrs () {
      return this.$props
    }
  },
  methods: {
    handleBlur () {
      if (this.localValue == null) {
        this.$emit('blur', null)
        return
      }

      let val = parseFloat(this.localValue)
      val = isNaN(val) ? null : this.calcDisplayValue(val)
      this.localValue = val
      this.$emit('blur', val)
    },
    handleThumbNudgeUpdate (delta) {
      // 精度下限修正
      if (truncDecimal(delta, this.decimalPlace) === 0) {
        delta = Math.sign(delta) * this.step
      }

      let val
      val = this.localValue == null ? 0 : parseFloat(this.localValue)

      if (isNaN(val)) {
        this.localValue = null
        return
      }

      this.localValue = this.calcDisplayValue(add(val, delta))
    },
    handleStep (sign) {
      this.handleThumbNudgeUpdate(this.step * sign)
    },
    calcDisplayValue (val) {
      return round(val, this.decimalPlace).toFixed(this.decimalPlace)
    }
  }
}
</script>

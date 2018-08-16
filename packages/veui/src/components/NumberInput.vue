<template>
  <veui-input v-nudge.y="{
      step,
      update: handleThumbNudgeUpdate
    }"
    :ui="ui"
    type="text"
    ref="input"
    v-model="localValue"
    v-on="listeners"
    v-bind="attrs"
    @blur="handleBlur"
    @input="handleInput"
    @change="handleChange"
    @focusin.native="focused = true"
    @focusout.native="focused = false"
    :class="{
      'veui-number-input': true,
      'veui-input-invalid': realInvalid,
      'veui-readonly': realReadonly,
      'veui-disabled': realDisabled,
      'veui-number-input-focused': focused
    }"
  >
    <template slot="before">
      <slot name="before"/>
    </template>
    <template slot="after">
      <div class="veui-number-input-controls">
        <veui-button
          ref="inc"
          class="veui-number-input-step-up"
          @click="increase"
          :disabled="!editable || reachMaxLimit"
          v-longpress.repeat="increase"
        >
          <veui-icon :name="icons.increase"/>
        </veui-button>
        <veui-button
          ref="dec"
          class="veui-number-input-step-down"
          @click="decrease"
          :disabled="!editable || reachMinLimit"
          v-longpress.repeat="decrease"
        >
          <veui-icon :name="icons.decrease"/>
        </veui-button>
      </div>
      <slot name="after"/>
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
import { sign, add, round } from '../utils/math'
import warn from '../utils/warn'
import { isInteger, isNaN, pick, get, find } from 'lodash'
import nudge from 'veui/directives/nudge'
import longpress from 'veui/directives/longpress'

const EVENTS = ['focus', 'blur', 'click', 'keyup', 'keydown', 'keypress']

export default {
  name: 'veui-number-input',
  mixins: [input, ui],
  directives: {
    nudge,
    longpress
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
        // -1 代表不处理精度
        return val === -1 || val >= 0 && val <= 20 && isInteger(val)
      }
    },
    max: Number,
    min: Number
  },
  data () {
    return {
      localValue: this.value,
      lastChangedValue: this.value,
      focused: false,
      forward: true,
      inputFocusable: true,
      controlFocusable: true
    }
  },
  computed: {
    listeners () {
      return getListeners(EVENTS, this)
    },
    attrs () {
      return {
        ...pick(this.$props, ['autofocus', 'selectOnFocus', 'autocomplete', 'placeholder']),
        name: this.realName,
        disabled: this.realDisabled,
        readonly: this.realReadonly
      }
    },
    isLocalEmpty () {
      return this.localValue == null || this.localValue === ''
    },
    editable () {
      return !this.realDisabled && !this.realReadonly
    },
    realMax () {
      let max = this.max
      if (get(this, 'formField.localRules.length')) {
        return get(find(this.formField.localRules, ({ name }) => name === 'max'), 'value') || max
      }
      return max
    },
    realMin () {
      let min = this.min
      if (get(this, 'formField.localRules.length')) {
        return get(find(this.formField.localRules, ({ name }) => name === 'min'), 'value') || min
      }
      return min
    },
    reachMaxLimit () {
      return this.realMax != null && this.value >= this.realMax
    },
    reachMinLimit () {
      return this.realMin != null && this.value <= this.realMin
    }
  },
  watch: {
    // value 和 localValue 仅在能正确 parse 及上下限限制内时保持同步，
    // value 只关心有效的数字值，localValue 是一个展示的中间状态
    value (val, oldVal) {
      // 这里主要处理 set 进来的情况
      // 1. 输入框内有值，set null
      // 2. set 的值和输入框内的值不一样
      if (val == null && !this.isLocalEmpty) {
        this.localValue = null
        this.lastChangedValue = null
        return
      }

      let localValue = this.calcDisplayValue(val)
      if (val != null && localValue !== this.calcDisplayValue(parseFloat(this.localValue))) {
        this.localValue = localValue

        if (+localValue !== val) {
          // set 进来也要 format 到精度范围内，如果不在精度内，要 $emit('input') 同步回去
          this.$emit('input', +localValue)
        }

        this.lastChangedValue = +localValue
      }
    }
  },
  created () {
    if (this.realMax < this.realMin) {
      warn('[veui-number-input] `max` value must not be less than `min` value.')
    }
    if (this.value > this.realMax || this.value < this.realMin) {
      warn('[veui-number-input] `value` must not be less than `min` value and not greater than `max` value.')
    }
  },
  methods: {
    handleInput (val, $event) {
      // 处理清空
      if (this.value != null && val === '') {
        this.$emit('input', null, $event)
        return
      }

      let parsedVal = parseFloat(val)
      let parsedOldVal = parseFloat(this.value)

      // 1. 等价或首次输入无效值
      // 2. 存在旧值的情况下输入无效值
      if (this.calcDisplayValue(parsedVal) === this.calcDisplayValue(parsedOldVal) ||
        isNaN(parsedVal) && this.value != null
      ) {
        // 不同步，保留原来的有效值，等 change 和 blur 处理
        return
      }

      this.$emit('input', +this.calcDisplayValue(parsedVal), $event)
    },
    handleChange (...args) {
      // change 产生的值有 5 种类型
      // 1. null 或 ''，表示清空
      // 2. 无效值
      // 3. 跨越上限
      // 4. 跨越精度
      // 5. 正常

      // 存在 6 种情况不需要 change
      // 1. 无效值，但上一次 change 的值不为空
      // 2. 无效值，并且上一次 change 的值为空
      // 3. 都为空
      // 4. 都不为空但 format 之后和上一次 change 的值相同
      // 5. 经过精度精确后和上一次 change 的值相同
      // 6. 经过上下限重置后和上一次 change 的值相同

      // 处理 1，需要重置值
      if (!this.isLocalEmpty && isNaN(parseFloat(this.localValue)) && this.lastChangedValue != null) {
        this.localValue = this.calcDisplayValue(this.lastChangedValue)
        return
      }

      // 处理 2-6
      if (
        this.calcDisplayValue(this.lastChangedValue) === this.calcDisplayValue(parseFloat(this.localValue))
      ) {
        return
      }

      this.$emit('change', this.value, args[1])
      this.lastChangedValue = this.value
    },
    handleBlur ($event) {
      if (this.isLocalEmpty) {
        return
      }

      // 处理产生 change 但是 format 后需要更新展示的情况，例如 null => +1s (change) => 1 (blur)
      let val = this.calcDisplayValue(parseFloat(this.localValue))
      this.localValue = val
    },
    handleThumbNudgeUpdate (delta) {
      if (!this.editable ||
        this.reachMaxLimit && sign(delta) > 0 ||
        this.reachMinLimit && sign(delta) < 0
      ) {
        return
      }

      if (this.decimalPlace !== -1) {
        // 精度下限修正
        if (Math.pow(10, -this.decimalPlace) > Math.abs(delta)) {
          delta = sign(delta) * this.step
        }
      }

      let val = this.value
      if (val != null) {
        // 超过上下限后操作，直接越值
        if (this.value > this.realMax && sign(delta) < 0) {
          val = this.realMax
        } else if (this.value < this.realMin && sign(delta) > 0) {
          val = this.realMin
        }
      } else {
        // 如果原来没有值，默认从 0 开始
        val = 0
      }

      let addedVal = this.decimalPlace === -1
        ? val + delta
        : add(val, delta, this.decimalPlace)
      let localValue = this.calcDisplayValue(addedVal)

      this.localValue = localValue
      this.$emit('input', +localValue)

      if (this.lastChangedValue !== +localValue) {
        this.$emit('change', +localValue)
        this.lastChangedValue = +localValue
      }
    },
    handleStep (sign) {
      this.handleThumbNudgeUpdate(this.step * sign)
    },
    increase () {
      this.handleStep(1)
    },
    decrease () {
      this.handleStep(-1)
    },
    filterLimitValue (val) {
      // 仅处理上下限问题
      if (isNaN(val) || val == null || val === '') {
        return val
      }

      if (this.realMax != null && val > this.realMax) {
        return this.realMax
      }

      if (this.realMin != null && val < this.realMin) {
        return this.realMin
      }

      return val
    },
    calcDisplayValue (val) {
      if (isNaN(val) || val == null || val === '') {
        return null
      }

      if (this.decimalPlace === -1) {
        return val.toString()
      }
      return round(this.filterLimitValue(val), this.decimalPlace).toFixed(this.decimalPlace)
    },
    activate () {
      this.$ref.input.activate()
    }
  }
}
</script>

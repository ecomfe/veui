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
    @focus="handleFocus"
    @focus.native="$refs.input.focus()"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
    @focusin.native="focused = true"
    @focusout.native="focused = false"
    :tabindex="tabindex"
    :class="{
      'veui-number-input': true,
      'veui-readonly': realReadonly,
      'veui-disabled': realDisabled,
      'veui-number-input-focused': focused
    }"
  >
    <template slot="before">
      <slot name="before"></slot>
    </template>
    <template slot="after">
      <div class="veui-number-input-controls">
        <veui-button
          ref="inc"
          class="veui-number-input-step-up"
          @click="handleStep(1)"
          :disabled="!editable"
          :tabindex="editable ? (controlFocusable ? '0' : '-1') : false"
        >
          <veui-icon :name="icons.increase"/>
        </veui-button>
        <veui-button
          class="veui-number-input-step-down"
          @click="handleStep(-1)"
          @focus="inputFocusable = false"
          @blur="enableInputFocus"
          :disabled="!editable"
          :tabindex="editable ? (controlFocusable ? '0' : '-1') : false"
        >
          <veui-icon :name="icons.decrease"/>
        </veui-button>
      </div>
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
import { sign, add, round } from '../utils/math'
import { isInteger, isNaN, pick } from 'lodash'
import nudge from 'veui/directives/nudge'

const EVENTS = ['focus', 'blur', 'click', 'keyup', 'keypress']

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
        // -1 代表不处理精度
        return val === -1 || val >= 0 && val <= 20 && isInteger(val)
      }
    }
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
  watch: {
    value (val, oldVal) {
      // 这里主要处理 set 进来的情况
      // 1. 输入框内有值，set null
      // 2. set 的值和输入框内的值不一样
      if (val == null && !this.isLocalEmpty) {
        this.localValue = null
        this.lastChangedValue = null
        return
      }

      // set 进来也要 format 到精度范围内，所以要 $emit('input') 同步回去
      let localValue = this.calcDisplayValue(val)
      if (val != null && localValue !== this.calcDisplayValue(this.localValue)) {
        this.localValue = localValue
        this.$emit('input', +localValue)
        this.lastChangedValue = +localValue
      }
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
    tabindex () {
      return this.realDisabled
        ? false
        : this.inputFocusable ? '0' : '-1'
    },
    editable () {
      return !this.realDisabled && !this.realReadonly
    }
  },
  mounted () {
    this.handleGlobalKeydown = ({ key }) => {
      if (key === 'Shift') {
        this.forward = false
      }
    }
    this.handleGlobalKeyup = ({ key }) => {
      if (key === 'Shift') {
        this.forward = true
      }
    }
    document.addEventListener('keydown', this.handleGlobalKeydown)
    document.addEventListener('keyup', this.handleGlobalKeyup)
  },
  destroyed () {
    document.removeEventListener('keydown', this.handleGlobalKeydown)
    document.removeEventListener('keyup', this.handleGlobalKeyup)
  },
  methods: {
    handleKeydown ($event) {
      switch ($event.key) {
        case 'Tab':
          if (this.forward && this.editable) {
            this.$refs.inc.focus()
            $event.preventDefault()
          }
          break
        case 'Shift':
          this.controlFocusable = false
          break
        default:
          break
      }
    },
    handleKeyup ($event) {
      switch ($event.key) {
        case 'Shift':
          this.enableControlFocus()
          break
        default:
          break
      }
    },
    handleFocus ($event) {
      if (this.forward) {
        this.enableControlFocus()
      } else {
        this.controlFocusable = false
      }
      this.inputFocusable = false
    },
    handleInput (val, $event) {
      // 处理清空
      if (this.value != null && val === '') {
        this.$emit('input', null, $event)
        return
      }

      // 处理 input 无效值或等价值
      let parsedVal = parseFloat(val)
      let parsedOldVal = parseFloat(this.value)

      // 等价或首次输入无效值
      if (isNaN(parsedVal) && isNaN(parsedOldVal) ||
        this.calcDisplayValue(parsedVal) === this.calcDisplayValue(parsedOldVal)
      ) {
        // 留给 blur 处理
        return
      }

      // 存在旧值的情况下输入非数字，直接拒绝 dom 上的修改，保持原有值
      if (isNaN(parsedVal) && this.value != null) {
        this.$nextTick(() => {
          this.localValue = this.calcDisplayValue(parsedOldVal)
        })
        return
      }

      this.$emit('input', +this.calcDisplayValue(parsedVal), $event)
    },
    handleChange (...args) {
      if (
        // 两种情况不需要 change
        // 1. 无效值，并且上一次 change 的值也为空
        // 2. 都不为空，但是 format 之后和上一次 change 的值相同
        isNaN(parseFloat(this.localValue)) && this.lastChangedValue == null ||
        !this.isLocalEmpty && this.lastChangedValue != null &&
          this.calcDisplayValue(this.lastChangedValue) === this.calcDisplayValue(parseFloat(this.localValue))
      ) {
        return
      }

      this.$emit('change', this.value, args[1])
      this.lastChangedValue = this.value
    },
    handleBlur ($event) {
      this.enableInputFocus()

      if (this.isLocalEmpty) {
        this.$emit('blur', $event)
        return
      }

      let val = parseFloat(this.localValue)
      val = isNaN(val) ? null : this.calcDisplayValue(val)
      this.localValue = val
      this.$emit('blur', $event)
    },
    handleThumbNudgeUpdate (delta) {
      if (!this.editable) {
        return
      }

      if (this.decimalPlace !== -1) {
        // 精度下限修正
        if (Math.pow(10, -this.decimalPlace) > Math.abs(delta)) {
          delta = sign(delta) * this.step
        }
      }

      let parsedVal = parseFloat(this.localValue)
      let val = this.localValue == null || isNaN(parsedVal) ? 0 : parsedVal
      let addedVal = this.decimalPlace === -1
        ? val + delta
        : add(val, delta, this.decimalPlace)
      let localValue = this.calcDisplayValue(addedVal)

      this.localValue = localValue
      this.$emit('input', +localValue)
      this.$emit('change', +localValue)
      this.lastChangedValue = +localValue
    },
    handleStep (sign) {
      this.handleThumbNudgeUpdate(this.step * sign)
    },
    calcDisplayValue (val) {
      if (this.decimalPlace === -1) {
        return val.toString()
      }
      return round(val, this.decimalPlace).toFixed(this.decimalPlace)
    },
    enableInputFocus () {
      setTimeout(() => {
        this.inputFocusable = true
      }, 0)
    },
    enableControlFocus () {
      setTimeout(() => {
        this.controlFocusable = true
      }, 0)
    }
  }
}
</script>

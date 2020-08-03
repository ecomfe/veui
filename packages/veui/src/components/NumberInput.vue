<template>
<veui-input
  ref="input"
  v-nudge.y="{
    step,
    update: stepValue
  }"
  :value="realInputValue"
  :ui="realUi"
  type="text"
  inputmode="numeric"
  v-bind="attrs"
  :class="{
    [$c('number-input')]: true,
    [$c('number-input-controls-focus')]: spinnerFocused
  }"
  v-on="listeners"
  @change="handleChange"
  @input="handleInput"
>
  <template
    v-if="isStrong"
    slot="before"
  >
    <veui-button
      v-longpress.repeat="decrease"
      :ui="uiParts.spinner"
      :class="[$c('number-input-step'), $c('number-input-step-down')]"
      :disabled="!editable || reachMinLimit"
      @click="decrease"
    >
      <veui-icon
        :name="icons.decrease"
        :aria-label="t('decrease', { value: step })"
      />
    </veui-button>
  </template>
  <template slot="after">
    <div
      v-if="editable && !isStrong"
      :class="$c('number-input-controls')"
      @focusin="spinnerFocused = true"
      @focusout="spinnerFocused = false"
    >
      <veui-button
        v-longpress.repeat="increase"
        :ui="uiParts.spinner"
        :class="[$c('number-input-step'), $c('number-input-step-up')]"
        :disabled="!editable || reachMaxLimit"
        @click="increase"
      >
        <veui-icon
          :name="icons.increase"
          :aria-label="t('increase', { value: step })"
        />
      </veui-button>
      <veui-button
        v-longpress.repeat="decrease"
        :ui="uiParts.spinner"
        :class="[$c('number-input-step'), $c('number-input-step-down')]"
        :disabled="!editable || reachMinLimit"
        @click="decrease"
      >
        <veui-icon
          :name="icons.decrease"
          :aria-label="t('decrease', { value: step })"
        />
      </veui-button>
    </div>
  </template>
  <template
    v-if="isStrong"
    slot="after"
  >
    <veui-button
      v-longpress.repeat="increase"
      :ui="uiParts.spinner"
      :class="[$c('number-input-step'), $c('number-input-step-up')]"
      :disabled="!editable || reachMaxLimit"
      @click="increase"
    >
      <veui-icon
        :name="icons.increase"
        :aria-label="t('increase', { value: step })"
      />
    </veui-button>
  </template>
</veui-input>
</template>

<script>
import Input from './Input'
import Button from './Button'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import activatable from '../mixins/activatable'
import input from '../mixins/input'
import i18n from '../mixins/i18n'
import Icon from './Icon'
import { sign, add, round } from '../utils/math'
import warn from '../utils/warn'
import { VALUE_EVENTS } from '../utils/dom'
import { isInteger, isNaN, get, find, omit, isFunction } from 'lodash'
import nudge from 'veui/directives/nudge'
import longpress from 'veui/directives/longpress'
import useControllable from '../mixins/controllable'

export default {
  name: 'veui-number-input',
  directives: {
    nudge,
    longpress
  },
  components: {
    'veui-icon': Icon,
    'veui-input': Input,
    'veui-button': Button
  },
  mixins: [prefix, ui, input, activatable, i18n, useControllable({
    prop: 'value',
    event: 'input',
    get (val) {
      return val == null ? null : val
    }
  })],
  inhertiAttrs: false,
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
        // -1 代表不强制小数位数
        return val === -1 || (val >= 0 && val <= 20 && isInteger(val))
      }
    },
    max: Number,
    min: Number,
    formatter: Function,
    parser: Function
  },
  data () {
    return {
      parsedInputValue: null, // 存储输入过程中的值即：parser(valueEmitFromInput)
      spinnerFocused: false
    }
  },
  computed: {
    realInputValue () {
      if (this.parsedInputValue == null) {
        // decimal 1 ; prop value 0.01; 这个时候最好也显示成 0.01
        let decimal = this.decimalPlace === -1 || typeof this.realValue !== 'number'
          ? -1
          : Math.max(getDecimalPlace(this.realValue), this.decimalPlace)
        return this.formatValue(this.realValue, decimal)
      }
      return this.formatValue(this.parsedInputValue, -1)
    },
    isStrong () {
      return this.uiProps.style === 'strong'
    },
    listeners () {
      return omit(this.$listeners, VALUE_EVENTS)
    },
    attrs () {
      return {
        ...this.$attrs,
        name: this.realName,
        disabled: this.realDisabled,
        readonly: this.realReadonly,
        invalid: this.realInvalid
      }
    },
    editable () {
      return !this.realDisabled && !this.realReadonly
    },
    realMax () {
      let max = this.max
      if (get(this, 'formField.localRules.length')) {
        return (
          get(
            find(this.formField.localRules, ({ name }) => name === 'max'),
            'value'
          ) || max
        )
      }
      return max
    },
    realMin () {
      let min = this.min
      if (get(this, 'formField.localRules.length')) {
        return (
          get(
            find(this.formField.localRules, ({ name }) => name === 'min'),
            'value'
          ) || min
        )
      }
      return min
    },
    reachMaxLimit () {
      return this.realMax != null && this.realValue != null && this.realValue >= this.realMax
    },
    reachMinLimit () {
      return this.realMin != null && this.realValue != null && this.realValue <= this.realMin
    }
  },
  watch: {
    // 输入过程中，外部 value 发生变化，那么重置输入
    // 这个逻辑是为了统一：当无法完全受控，那么 prop 变化时如何处理？目前逻辑是 prop 覆盖 local
    value (val) {
      if (this.parsedInputValue != null) {
        // 没有 local 状态了，就是 realValue 生效了，见 realInputValue
        this.parsedInputValue = null
      }
    }
  },
  created () {
    if (this.realMax < this.realMin) {
      warn(
        '[veui-number-input] `max` value must not be less than `min` value.',
        this
      )
    }
    if (this.value > this.realMax || this.value < this.realMin) {
      warn(
        '[veui-number-input] `value` must not be less than `min` value and not greater than `max` value.',
        this
      )
    }
  },
  methods: {
    parseValue (val, asNumber) {
      val = isFunction(this.parser)
        ? this.parser(val)
        : val
      return asNumber ? numberParser(val) : val
    },
    formatValue (val, decimalPlace) {
      let strVal = decimalFormatter(val, decimalPlace)
      return isFunction(this.formatter)
        ? this.formatter(val, strVal)
        : strVal
    },
    handleInput (val) {
      this.parsedInputValue = this.parseValue(val, false)
    },
    getValidValue (val, decimalPlace = -1) {
      val = numberParser(val)
      if (isNaN(val)) {
        return val
      }

      // limit check
      if (this.realMax != null && val > this.realMax) {
        val = this.realMax
      } else if (this.realMin != null && val < this.realMin) {
        val = this.realMin
      }

      return decimalPlace === -1
        ? val
        : Number(round(val, decimalPlace).toFixed(decimalPlace))
    },
    handleChange (val) {
      let parsed = this.parseValue(val, true)
      this.parsedInputValue = null
      // 3 种 case:
      //  1. 置空(null, 会 commit null)
      //  2. local 输入置空(NaN), 清空 local，让 realValue 生效
      //  3. commit
      parsed = parsed === '' || parsed == null
        ? null
        : this.getValidValue(parsed, this.decimalPlace)

      if (!isNaN(parsed)) {
        this.updateValue(parsed)
      }
    },
    stepValue (delta) {
      if (
        !this.editable ||
        (this.reachMaxLimit && sign(delta) > 0) ||
        (this.reachMinLimit && sign(delta) < 0)
      ) {
        return
      }

      let limitDecimal = this.decimalPlace !== -1
      if (limitDecimal) {
        // 精度下限修正
        if (Math.pow(10, -this.decimalPlace) > Math.abs(delta)) {
          delta = sign(delta) * this.step
        }
      }

      let val = NaN
      if (this.parsedInputValue != null) {
        // 输入的值要尽量 parse
        val = this.getValidValue(this.parsedInputValue)
      }
      if (isNaN(val) && this.realValue != null) {
        val = typeof this.realValue === 'number'
          ? this.realValue
          : this.getValidValue(this.realValue) // in case of prop value: `1km`
      }
      if (isNaN(val)) {
        // 保留之前 fallback 到0 的逻辑吧，如果 0 不在范围内会 clamp
        val = this.getValidValue(0)
      }

      let decimalPlace = limitDecimal
        ? this.decimalPlace
        : getMaxDecimalPlace(val, delta)

      val = this.getValidValue(add(val, delta, decimalPlace), decimalPlace)
      this.parsedInputValue = null
      this.updateValue(val)
    },
    updateValue (val) {
      let changed = this.isControlled('value')
        ? this.value !== val
        : this.realValue !== val
      this.commit('value', val)
      if (changed) {
        this.$emit('change', val)
      }
    },
    increase () {
      this.stepValue(this.step)
    },
    decrease () {
      this.stepValue(-this.step)
    },
    focus () {
      this.$refs.input.focus()
    },
    activate () {
      this.$refs.input.activate()
    }
  }
}

function getDecimalPlace (val) {
  val = String(val)
  let idx = val.indexOf('e-')
  if (idx >= 0) {
    return Number(val.slice(idx + 2))
  }
  idx = val.indexOf('.')
  return idx >= 0
    ? val.length - idx - 1
    : 0
}

function getMaxDecimalPlace (val1, val2) {
  return Math.max(getDecimalPlace(val1), getDecimalPlace(val2))
}

function decimalFormatter (val, decimalPlace) {
  let isNum = typeof val === 'number'
  if (decimalPlace === -1 || !isNum) {
    return val == null ? '' : String(val)
  } else if (isNum) {
    return val.toFixed(decimalPlace)
  }
}

function numberParser (val) {
  let parsed = parseFloat(val)
  return isNaN(parsed) ? val : parsed
}
</script>

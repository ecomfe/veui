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
  composition
  v-bind="attrs"
  :class="{
    [$c('number-input')]: true,
    [$c('number-input-controls-focus')]: spinnerFocused
  }"
  :mask="mask"
  v-on="listeners"
  @change="handleChange"
  @input="handleInput"
>
  <template v-if="isStrong" slot="before">
    <veui-button
      v-longpress.repeat="decrease"
      tabindex="-1"
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
        tabindex="-1"
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
        tabindex="-1"
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
  <template v-if="isStrong" slot="after">
    <veui-button
      v-longpress.repeat="increase"
      tabindex="-1"
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
import { isInteger, isNaN, get, find, omit, isFunction, repeat } from 'lodash'
import nudge from '../directives/nudge'
import longpress from '../directives/longpress'
import useControllable from '../mixins/controllable'
import '../common/global'

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
  mixins: [
    prefix,
    ui,
    input,
    activatable,
    i18n,
    useControllable({
      prop: 'value',
      event: 'input',
      get (val) {
        return val == null ? null : val
      }
    })
  ],
  inheritAttrs: false,
  props: {
    ui: String,
    value: [Number, String],
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
    format: Function,
    parse: Function
  },
  data () {
    return {
      parsedInputValue: null, // 存储输入过程中的值即：parse(valueEmitFromInput)
      spinnerFocused: false
    }
  },
  computed: {
    realInputValue () {
      if (this.parsedInputValue == null) {
        // decimal 1 ; prop value 0.01; 这个时候最好也显示成 0.01
        let decimal =
          this.decimalPlace === -1 || typeof this.realValue !== 'number'
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
      return omit(this.listenersWithValidations, VALUE_EVENTS)
    },
    attrs () {
      return {
        inputmode: 'decimal',
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
        let maxOfField = get(
          find(this.formField.localRules, ({ name }) => name === 'max'),
          'value'
        )
        return maxOfField == null ? max : maxOfField
      }
      return max
    },
    realMin () {
      let min = this.min
      if (get(this, 'formField.localRules.length')) {
        let minOfField = get(
          find(this.formField.localRules, ({ name }) => name === 'min'),
          'value'
        )
        return minOfField == null ? min : minOfField
      }
      return min
    },
    reachMaxLimit () {
      return (
        this.realMax != null &&
        this.realValue != null &&
        this.realValue >= this.realMax
      )
    },
    reachMinLimit () {
      return (
        this.realMin != null &&
        this.realValue != null &&
        this.realValue <= this.realMin
      )
    },
    checkValues () {
      return {
        max: this.realMax,
        min: this.realMin,
        value: this.value
      }
    },
    mask () {
      let { realMax, realMin, decimalPlace } = this
      let prefix = realMax < 0 ? '-' : realMin >= 0 ? '' : '-?'
      let mask =
        decimalPlace === -1
          ? '#*.#*'
          : `#*${decimalPlace === 0 ? '' : '.'}${repeat('#', decimalPlace)}`

      return `${prefix}${mask}`
    }
  },
  watch: {
    // 输入过程中，外部 value 发生变化，那么重置输入
    // 这个逻辑是为了统一：当无法完全受控，那么 prop 变化时如何处理？目前逻辑是 prop 覆盖 local
    value () {
      if (this.parsedInputValue != null) {
        // 没有 local 状态了，就是 realValue 生效了，见 realInputValue
        this.parsedInputValue = null
      }
    },
    checkValues ({ max, min, value }) {
      if (max != null && min != null && max < min) {
        warn(
          '[veui-number-input] `max` value must not be less than `min` value.',
          this
        )
      }
      let maxError = max != null && value != null && value > max
      let minError = min != null && value != null && value < min
      if (maxError || minError) {
        warn(
          '[veui-number-input] `value` must not be less than `min` value and not greater than `max` value.',
          this
        )
      }
    }
  },
  methods: {
    parseValue (val, asNumber) {
      val = isFunction(this.parse) ? this.parse(val) : val
      return asNumber ? parseFloat(val) : val
    },
    formatValue (val, decimalPlace) {
      let strVal = formatDecimal(val, decimalPlace)
      return isFunction(this.format) ? this.format(val, strVal) : strVal
    },
    handleInput (val) {
      this.parsedInputValue = this.parseValue(val, false)
    },
    getValidValue (val, decimalPlace = -1) {
      val = parseFloat(val)
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
      let parsed = this.parseValue(val, false)
      this.parsedInputValue = null // 下面三种 case 都是 realValue 生效，所以直接置空该值
      // 3 种 case:
      //  1. 输入是空，会 commit null
      //  2. 输入解析出来是 NaN， 那么 local 置空，让 realValue 生效
      //  3. 输入合法，commit
      parsed = isEmpty(parsed)
        ? null
        : this.getValidValue(parsed, this.decimalPlace)

      if (!isNaN(parsed)) {
        // 非法值，直接上面置空了，让 realValue 生效
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
        val =
          typeof this.realValue === 'number'
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
  return idx >= 0 ? val.length - idx - 1 : 0
}

function getMaxDecimalPlace (val1, val2) {
  return Math.max(getDecimalPlace(val1), getDecimalPlace(val2))
}

function formatDecimal (val, decimalPlace) {
  let isNum = typeof val === 'number'
  if (decimalPlace === -1 || !isNum) {
    return val == null ? '' : String(val)
  } else {
    return val.toFixed(decimalPlace)
  }
}

function isEmpty (val) {
  return val == null || (typeof val === 'string' && val.trim() === '')
}
</script>

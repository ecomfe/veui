<template>
<div
  :class="{
    [$c('input')]: true,
    [$c('focus')]: focused,
    [$c('input-hidden')]: type === 'hidden',
    [$c('input-autofill')]: autofill,
    [$c('input-safari')]: isSafari,
    [$c('invalid')]: realInvalid || lengthOverflow,
    [$c('readonly')]: realReadonly,
    [$c('disabled')]: realDisabled
  }"
  :ui="realUi"
  v-on="containerListeners"
  @mousedown="handleMousedown"
>
  <template v-if="$slots.before">
    <div :class="$c('input-before')">
      <slot name="before"/>
    </div>
  </template>
  <div :class="$c('input-content')">
    <div v-show="empty" :class="$c('input-placeholder')" @selectstart.prevent>
      <slot name="placeholder">{{ placeholder }}</slot>
    </div>
    <!-- 如果以后 Vue 对 native input 完全受控，那么这里就不能用 realValue 了 -->
    <input
      ref="input"
      v-maska="realMask"
      :value="tmpInputValue == null ? realValue : tmpInputValue"
      :class="$c('input-input')"
      v-bind="attrs"
      v-on="inputListeners"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @change="handleChange"
      @transitionstart="handleTransitionStart"
    >
    <span
      v-if="this.$listeners.textwidthchange"
      ref="measurer"
      :class="[$c('input-input'), $c('input-measurer')]"
    />
  </div>
  <template v-if="$slots.after || clearable || realMaxlength !== null">
    <div :class="$c('input-after')">
      <veui-button
        v-if="clearable"
        v-show="editable && !empty"
        :class="{
          [$c('input-clear')]: true,
          [$c('input-clear-has-after')]: !!$slots.after
        }"
        :ui="uiParts.clear"
        :aria-label="t('clear')"
        @click.stop="clear"
      >
        <veui-icon :name="icons.clear"/>
      </veui-button>
      <span
        v-if="realMaxlength !== null"
        :class="{
          [$c('input-count')]: true,
          [$c('input-count-overflow')]: lengthOverflow
        }"
      >{{ length }}/{{ realMaxlength }}</span>
      <slot name="after"/>
    </div>
  </template>
</div>
</template>

<script>
import { maska } from '@justfork/maska'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import useControllable from '../mixins/controllable'
import activatable from '../mixins/activatable'
import i18n from '../mixins/i18n'
import { includes, pick } from 'lodash'
import Button from './Button'
import Icon from './Icon'
import { normalizeInt } from '../utils/helper'
import { MOUSE_EVENTS, KEYBOARD_EVENTS, FOCUS_EVENTS } from '../utils/dom'
import warn from '../utils/warn'
import '../common/global'
import i18nManager from '../managers/i18n'
import { isFirefox, isSafari } from '../utils/bom'

const TYPE_LIST = ['text', 'password', 'hidden']

const COMPOSITION_UPDATE = 'UPDATE'
const COMPOSITION_INPUT = 'INPUT'

const TRIM_RE = {
  start: /^\s+/g,
  end: /\s+$/g
}

// Firefox's execution order of event handler and microtask is different from
// other browsers, so we only enables input masks on other browsers for now.
const supportsMasking = process.env.VUE_ENV !== 'server' && !isFirefox()

export default {
  name: 'veui-input',
  components: {
    'veui-button': Button,
    'veui-icon': Icon
  },
  directives: {
    maska
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
        // 兼容以前 prop value 是 number，这里统一格式化成 string
        // 最好不要用 number 吧，toString 可能会有精度问题
        return typeof val === 'number' && !isNaN(val) ? String(val) : val || ''
      }
    })
  ],
  inheritAttrs: false,
  props: {
    ui: String,
    type: {
      type: String,
      default: 'text',
      validator (val) {
        return includes(TYPE_LIST, val)
      }
    },
    placeholder: String,
    value: {
      type: [String, Number],
      default: ''
    },
    selectOnFocus: Boolean,
    composition: Boolean,
    clearable: Boolean,
    maxlength: [Number, String],
    getLength: Function,
    strict: Boolean,
    trim: {
      type: [Boolean, String],
      default: false,
      validator (val) {
        return (
          typeof val === 'boolean' ||
          val === 'start' ||
          val === 'end' ||
          val === 'both'
        )
      }
    },
    mask: [String, Object]
  },
  data () {
    return {
      focused: false,
      compositionValue: '',

      // vue 在 composing 时不会更新 input 的 value，这个暂时值用来用 compositionEnd 时保存输入值
      // 避免 end 时，vue 用旧的 realValue 更新 input，然后 firefox 下 end 之后的 input 同步上来的值不对
      // 具体情况比较复杂，所以直接输入过程中保留当前输入的值，输入结束再完全由 realValue 决定
      // 不能是空字符串，否则无法区分：用户在清空内容 vs. nextTick 中的 reset
      tmpInputValue: null,
      composing: false,
      autofill: false,
      isSafari: false
    }
  },
  computed: {
    realMaxlength () {
      return normalizeInt(this.maxlength)
    },
    attrs () {
      return {
        ...this.$attrs,
        maxlength: this.strict ? this.realMaxlength : null,
        type: this.type,
        name: this.realName,
        disabled: this.realDisabled,
        readonly: this.realReadonly
      }
    },
    inputListeners () {
      return pick(this.listenersWithValidations, [
        ...KEYBOARD_EVENTS,
        ...FOCUS_EVENTS
      ])
    },
    containerListeners () {
      return pick(this.listenersWithValidations, MOUSE_EVENTS)
    },
    editable () {
      return !this.realDisabled && !this.realReadonly
    },
    empty () {
      // compositionValue 不会是数字 0
      return !this.compositionValue && this.realValue === ''
    },
    realSelectOnFocus () {
      return this.type !== 'hidden' && this.selectOnFocus
    },
    length () {
      return typeof this.getLength === 'function'
        ? this.getLength(this.realValue)
        : this.realValue.length
    },
    lengthOverflow () {
      if (this.realMaxlength == null) {
        return false
      }
      return this.length > this.realMaxlength
    },
    checkStrict () {
      return {
        strict: this.strict,
        getLength: this.getLength
      }
    },
    realMask () {
      return this.mask && supportsMasking ? this.mask : null
    }
  },
  watch: {
    autofill (val) {
      if (val) {
        this.$emit('autofill')
      }

      this.$emit('autofillchange', val)
    },
    checkStrict: {
      handler ({ strict, getLength } = {}) {
        if (strict && getLength) {
          warn(
            '[veui-input] `strict` must be `false` when `getLength` is provided.',
            this
          )
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.isSafari = isSafari()
    this.syncTextWidth()
  },
  methods: {
    syncTextWidth () {
      if (this.$listeners.textwidthchange) {
        const { input, measurer } = this.$refs
        measurer.textContent = input.value

        this.$nextTick(() => {
          this.$emit('textwidthchange', measurer.scrollWidth)
        })
      }
    },
    handleInput (e) {
      this.syncTextWidth()
      this.tmpInputValue = e.target.value

      if (this.composing === COMPOSITION_UPDATE) {
        this.composing = COMPOSITION_INPUT
      }
      // 分2种情况
      // 1. 感知输入法，触发原生 input 事件就必须向上继续抛出
      // 2. 不感知输入法，在没有输入法状态的值的情况下需要向上抛出
      // 对于不感知输入法同步方案见下：
      // chrome: input(emit) -> ... -> compositionstart -> compositionupdate -> input(not emit) -> compositionend(emit)
      // firefox: input(emit) -> ... -> compositionstart -> compositionupdate -> compositionend(not emit) -> input(emit)
      // 可以归纳出：
      //  紧跟 compositionupdate 后面的 input 不要往上 sync
      //  紧跟 input 后面的 compositionend 往上 sync
      if (this.composition || this.composing !== COMPOSITION_INPUT) {
        this.updateValue(e.target.value, e)
      }
    },
    handleChange (e) {
      let val = this.trimValue(e.target.value)
      this.updateValue(val)
      this.$emit('change', val, e)
    },
    handleMousedown (e) {
      setTimeout(() => {
        this.focus()
      })
    },
    handleCompositionUpdate (e) {
      this.compositionValue = e.data
      this.tmpInputValue = e.target.value
      this.composing = COMPOSITION_UPDATE
    },
    handleCompositionEnd (e) {
      this.compositionValue = ''
      this.tmpInputValue = e.target.value
      if (this.composing === COMPOSITION_INPUT) {
        this.updateValue(e.target.value, e)
      }
      this.composing = false
    },
    validate () {
      let result = true
      if (this.realMaxlength != null) {
        if (this.lengthOverflow) {
          result = i18nManager.get('rules.maxLength', {
            ruleValue: this.realMaxlength
          })
        }

        if (this.field) {
          this.field.updateInputValidities(result)
        }
      }
      return result
    },
    trimValue (val) {
      if (!this.trim) {
        return val
      }
      if (this.trim === true || this.trim === 'both') {
        return val.trim()
      }
      return val.replace(TRIM_RE[this.trim], '')
    },
    updateValue (value, ...args) {
      this.commit('value', value, ...args)
      this.$nextTick(() => {
        let { input } = this.$refs
        this.tmpInputValue = null
        if (input && this.realValue !== input.value) {
          input.value = this.realValue
        }
        this.validate()
      })
    },
    handleFocus (e) {
      this.focused = true
      if (this.realSelectOnFocus && e.target) {
        e.target.select()
      }
    },
    handleBlur () {
      this.focused = false
    },
    focus () {
      let { input } = this.$refs
      if (input) {
        input.focus()
      }
    },
    activate () {
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.focus()
    },
    clear () {
      this.compositionValue = ''
      this.commit('value', '')
      this.focus()
      this.$emit('clear')
    },
    handleTransitionStart ({ propertyName }) {
      // we are changing opacity when autofill state changes
      if (propertyName === 'opacity') {
        this.autofill = this.$refs.input.matches(':-webkit-autofill')
      }
    }
  }
}
</script>

<style lang="less">
@veui-prefix: veui;

.@{veui-prefix}-input-input {
  opacity: 1;
  transition: opacity 0.0001s;

  &:-webkit-autofill {
    opacity: 0.9999;
  }
}
</style>

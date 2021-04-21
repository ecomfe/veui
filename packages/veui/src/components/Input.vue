<template>
<div
  :class="{
    [$c('input')]: true,
    [$c('focus')]: focused,
    [$c('input-hidden')]: type === 'hidden',
    [$c('input-autofill')]: autofill,
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
    <div
      v-show="empty"
      :class="$c('input-placeholder')"
      @selectstart.prevent="() => false"
    >
      <slot name="placeholder">{{ placeholder }}</slot>
    </div>
    <!-- 如果以后 Vue 对 native input 完全受控，那么这里就不能用 realValue 了 -->
    <input
      ref="input"
      :value="tmpInputValue == null ? realValue : tmpInputValue"
      :class="$c('input-input')"
      v-bind="attrs"
      v-on="inputListeners"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @change="$emit('change', $event.target.value, $event)"
    >
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

const TYPE_LIST = ['text', 'password', 'hidden']

const COMPOSITION_UPDATE = 'UPDATE'
const COMPOSITION_INPUT = 'INPUT'

export default {
  name: 'veui-input',
  components: {
    'veui-button': Button,
    'veui-icon': Icon
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
    strict: Boolean
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
      autofill: false
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
      return pick(this.$listeners, [...KEYBOARD_EVENTS, ...FOCUS_EVENTS])
    },
    containerListeners () {
      return pick(this.$listeners, MOUSE_EVENTS)
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
    }
  },
  watch: {
    autofill (val) {
      if (val) {
        this.$emit('autofill')
      }
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
  methods: {
    handleInput (e) {
      this.tmpInputValue = e.target.value
      setTimeout(() => {
        try {
          this.autofill = !!this.$el.querySelector(':-webkit-autofill')
        } catch (e) {}
      })
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
    updateValue (value, ...args) {
      this.commit('value', value, ...args)
      this.$nextTick(() => {
        let input = this.$refs.input
        this.tmpInputValue = null
        if (input && this.realValue !== input.value) {
          input.value = this.realValue
        }
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
      this.$refs.input.focus()
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
    }
  }
}
</script>

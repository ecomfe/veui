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
      {{ placeholder }}
    </div>
    <input
      ref="input"
      v-model="localValue"
      :class="$c('input-input')"
      v-bind="attrs"
      v-on="inputListeners"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @compositionupdate="handleComposition"
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
      >
        {{ length }}/{{ realMaxlength }}
      </span>
      <slot name="after"/>
    </div>
  </template>
</div>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import activatable from '../mixins/activatable'
import i18n from '../mixins/i18n'
import { includes, pick } from 'lodash'
import Button from './Button'
import Icon from './Icon'
import { normalizeInt } from '../utils/helper'
import { MOUSE_EVENTS, KEYBOARD_EVENTS, FOCUS_EVENTS } from '../utils/dom'

const TYPE_LIST = ['text', 'password', 'hidden']

export default {
  name: 'veui-input',
  components: {
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [prefix, ui, input, activatable, i18n],
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
    strict: Boolean
  },
  data () {
    return {
      focused: false,
      localValue: this.value == null ? '' : this.value,
      compositionValue: null,
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
      return (
        !this.compositionValue &&
        (this.localValue == null || this.localValue === '')
      )
    },
    realSelectOnFocus () {
      return this.type !== 'hidden' && this.selectOnFocus
    },
    length () {
      return this.localValue == null ? 0 : this.localValue.length
    },
    lengthOverflow () {
      if (this.realMaxlength == null) {
        return false
      }
      return this.length > this.realMaxlength
    }
  },
  watch: {
    value (val) {
      this.localValue = val == null ? '' : val
    },
    autofill (val) {
      if (val) {
        this.$emit('autofill')
      }
    }
  },
  methods: {
    handleInput (e) {
      setTimeout(() => {
        try {
          this.autofill = !!this.$el.querySelector(':-webkit-autofill')
        } catch (e) {}
      })

      // 分2种情况
      // 1. 感知输入法，触发原生 input 事件就必须向上继续抛出
      // 2. 不感知输入法，在没有输入法状态的值的情况下需要向上抛出
      //
      // compositionupdate -> compositionend -> input
      if (this.composition || !this.compositionValue) {
        this.$emit('input', e.target.value, e)
      }
    },
    handleMousedown (e) {
      setTimeout(() => {
        this.focus()
      })
    },
    handleComposition (e) {
      this.compositionValue = e.data
    },
    handleCompositionEnd () {
      this.compositionValue = ''
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
      this.localValue = ''
      this.compositionValue = ''
      this.focus()
      this.$emit('input', '')
      this.$emit('clear')
    }
  }
}
</script>

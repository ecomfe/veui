<template>
<div
  v-if="type !== 'textarea'"
  :class="{
    'veui-input': true,
    'veui-input-focused': focused,
    'veui-input-hidden': type === 'hidden',
    'veui-readonly': realReadonly,
    'veui-disabled': realDisabled
  }"
  :ui="ui"
>
  <slot name="before"></slot>
  <input
    ref="input"
    class="veui-input-input"
    v-model="localValue"
    v-bind="attrs"
    v-on="listeners"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="handleInput"
    @change="$emit('change', $event.target.value, $event)"
  >
  <slot name="after"></slot>
</div>
<veui-textarea
  v-else
  ref="input"
  v-model="localValue"
  v-bind="attrs"
  v-on="listeners"
  @change="handleTextareaChange"
></veui-textarea>
</template>

<script>
import input from '../mixins/input'
import { omit, includes } from 'lodash'
import Textarea from './Textarea'
import { getListeners } from '../utils/helper'
import warn from '../utils/warn'

const EVENTS = ['click', 'keyup', 'keydown', 'keypress']
const TYPE_LIST = ['text', 'password', 'hidden', 'textarea']

export default {
  name: 'veui-input',
  mixins: [input],
  components: {
    'veui-textarea': Textarea
  },
  props: {
    ui: String,
    type: {
      type: String,
      default: 'text',
      validator (val) {
        if (val === 'textarea') {
          warn('[veui-input] `type` value `textarea` is deprecated and will be removed in the next version.' +
            ' Use `veui-textarea` component instead.')
        }
        return includes(TYPE_LIST, val)
      }
    },
    autocomplete: String,
    placeholder: String,
    value: {
      type: [String, Number],
      default: ''
    },
    autofocus: Boolean,
    selectOnFocus: Boolean,
    composition: Boolean,
    /**
     * @deprecated
     */
    lineNumber: Boolean,
    /**
     * @deprecated
     */
    rows: [String, Number],
    /**
     * @deprecated
     */
    autoresize: Boolean
  },
  data () {
    return {
      focused: false
    }
  },
  computed: {
    attrs () {
      return {
        ...omit(this.$props,
          'selectOnFocus',
          ...(this.type === 'textarea'
            ? ['type', 'composition', 'autocomplete']
            : ['lineNumber', 'rows', 'autoresize'])
        ),
        name: this.realName,
        disabled: this.realDisabled,
        readonly: this.realReadonly
      }
    },
    listeners () {
      return getListeners(this.type !== 'textarea' ? EVENTS : ['focus', 'blur', ...EVENTS], this)
    }
  },
  watch: {
    value: {
      handler (val) {
        this.localValue = val
      },
      immediate: true
    },
    localValue (val) {
      if (this.type === 'textarea' && this.value !== val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleInput ($event) {
      // 分3种情况
      // 1. 感知输入法，触发原生 input 事件就必须向上继续抛出
      // 2. 不感知输入法
      //  2.1 vue 底层会对原生 input 的 v-model 做忽略输入法组合态处理，所以 localValue 和 $event.target.value 不同步，只有当 localValue 产生变化时才向上继续抛出
      //  2.2 在 localValue 没有变化的情况下，原则上不抛出
      if (this.composition || !this.composition && this.localValue !== this.value) {
        this.$emit('input', $event.target.value, $event)
      }
    },
    handleTextareaChange (value, $event) {
      this.$emit('change', value, $event)
    },
    handleFocus ($event) {
      this.focused = true
      this.$emit('focus', $event)
    },
    handleBlur ($event) {
      this.focused = false
      this.$emit('blur', $event)
    },
    focus () {
      this.$refs.input.focus()
    },
    activate () {
      this.$refs.input.focus()
    }
  },
  mounted () {
    if (this.type !== 'hidden') {
      if (this.placeholder && !('placeholder' in document.createElement('input'))) {
        // TODO
        // this.$on('focus', handlePlaceHolder)
      }
      if (this.selectOnFocus) {
        this.$on('focus', ($event) => $event.target.select())
      }
    }
  }
}
</script>

<template>
<div
  :class="{
    'veui-input': true,
    'veui-input-focused': focused,
    'veui-input-hidden': type === 'hidden',
    'veui-readonly': realReadonly,
    'veui-disabled': realDisabled
  }"
  :ui="ui"
>
  <template v-if="$slots.before">
    <div class="veui-input-before"><slot name="before"/></div>
  </template>
  <label class="veui-input-main">
    <span
      @selectstart.prevent="() => false"
      class="veui-input-placeholder"
      v-if="isOldVersion && type !== 'hidden'"
      v-show="placeholderVisible"
    >{{ placeholder }}</span>
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
  </label>
  <span
    v-if="clearable"
    v-show="editable && !placeholderVisible"
    class="veui-input-clear"
  >
    <button type="button"
      aria-label="清除"
      class="veui-input-clear-button"
      @click.stop="clear"
    ><veui-icon :name="icons.remove"/></button>
  </span>
  <template v-if="$slots.after">
    <div class="veui-input-after"><slot name="after"/></div>
  </template>
</div>
</template>

<script>
import input from '../mixins/input'
import ui from '../mixins/ui'
import { omit, includes } from 'lodash'
import Icon from './Icon'
import { getListeners } from '../utils/helper'

const EVENTS = ['click', 'keyup', 'keydown', 'keypress', 'focus', 'blur']
const TYPE_LIST = ['text', 'password', 'hidden']

export default {
  name: 'veui-input',
  mixins: [input, ui],
  components: {
    'veui-icon': Icon
  },
  props: {
    ui: String,
    type: {
      type: String,
      default: 'text',
      validator (val) {
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
    clearable: Boolean
  },
  data () {
    return {
      focused: false,
      localValue: this.value,
      compositionValue: this.value
    }
  },
  computed: {
    attrs () {
      return {
        ...omit(this.$props, 'selectOnFocus', 'composition', 'value', 'clearable'),
        name: this.realName,
        disabled: this.realDisabled,
        readonly: this.realReadonly,
        ...this.$attrs
      }
    },
    listeners () {
      return getListeners(EVENTS, this)
    },
    isOldVersion () {
      return !('placeholder' in document.createElement('input'))
    },
    editable () {
      return !this.realDisabled && !this.realReadonly
    },
    placeholderVisible () {
      return this.compositionValue == null || this.compositionValue === ''
    }
  },
  watch: {
    value (val) {
      if (val !== this.localValue) {
        this.localValue = val
        this.compositionValue = val
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
      this.compositionValue = $event.target.value
    },
    handleFocus ($event) {
      this.focused = true
    },
    handleBlur ($event) {
      this.focused = false
    },
    focus () {
      this.$refs.input.focus()
    },
    activate () {
      this.$refs.input.focus()
    },
    clear () {
      this.localValue = ''
      this.compositionValue = ''
      this.$refs.input.focus()
      this.$emit('input', '')
    }
  },
  mounted () {
    if (this.type !== 'hidden' && this.selectOnFocus) {
      this.$on('focus', $event => $event.target.select())
    }
  }
}
</script>

<template>
<input
  v-if="type !== 'textarea'"
  class="veui-input"
  v-bind="attrs"
  v-model="localValue"
  ref="input"
  @focus="$emit('focus', $event)"
  @click="$emit('click', $event)"
  @blur="$emit('blur', $event)"
  @change="$emit('change', $event.target.value, $event)"
  @input="handleInput"
  @keyup="$emit('keyup', $event)"
  @keydown="$emit('keydown', $event)"
  @keypress="$emit('keypress', $event)"
>
<veui-textarea
  v-else
  :class="{ 'veui-textarea-resizable': resizable }"
  v-bind="attrs"
  v-model="localValue"
  ref="input"
  @focus="$emit('focus', $event)"
  @click="$emit('click', $event)"
  @blur="$emit('blur', $event)"
  @change="$emit('change', $event.target.value, $event)"
  @input="handleInput"
  @keyup="$emit('keyup', $event)"
  @keydown="$emit('keydown', $event)"
  @keypress="$emit('keypress', $event)"
></veui-textarea>
</template>

<script>
import { input } from '../mixins'
import { omit, includes } from 'lodash'
import Textarea from './Textarea'

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
        return includes(TYPE_LIST, val)
      }
    },
    autocomplete: String,
    placeholder: String,
    value: {
      type: [String, Number],
      default: ''
    },
    rows: [String, Number],
    autofocus: Boolean,
    selectOnFocus: Boolean,
    composition: Boolean,
    resizable: Boolean,
    fitContent: Boolean
  },
  data () {
    return {
      localValue: this.value
    }
  },
  computed: {
    attrs () {
      return {
        ...omit(this.$props,
          'selectOnFocus', 'fitContent',
          'composition', 'resizable',
          ...(this.type === 'textarea' ? ['type'] : ['rows'])
        ),
        name: this.realName,
        disabled: this.realDisabled,
        readonly: this.realReadonly
      }
    }
  },
  watch: {
    value (newVal) {
      this.localValue = newVal
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
        this.$on('focus', (e) => e.target.select())
      }
      if (this.fitContent) {
        // TODO
      }
    }
  }
}
</script>

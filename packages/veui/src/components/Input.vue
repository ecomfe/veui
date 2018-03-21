<template>
<input
  v-if="type !== 'textarea'"
  ref="input"
  class="veui-input"
  :ui="ui"
  v-model="localValue"
  v-bind="attrs"
  v-on="listeners"
  @input="handleInput"
  @change="$emit('change', $event.target.value, $event)"
>
<veui-textarea
  v-else
  ref="input"
  :class="{ 'veui-textarea-resizable': resizable }"
  :ui="ui"
  v-model="localValue"
  v-bind="attrs"
  v-on="listeners"
  @change="handleTextareaChange"
></veui-textarea>
</template>

<script>
import ui from '../mixins/ui'
import input from '../mixins/input'
import { omit, includes } from 'lodash'
import Textarea from './Textarea'

const TYPE_LIST = ['text', 'password', 'hidden', 'textarea']

export default {
  name: 'veui-input',
  mixins: [ui, input],
  components: {
    'veui-textarea': Textarea
  },
  props: {
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
    let listeners = [
      'click', 'focus', 'blur',
      'keyup', 'keydown', 'keypress'
    ].reduce((acc, type) => {
      acc[type] = event => {
        this.$emit(type, event)
      }
      return acc
    }, {})

    return {
      localValue: this.value,
      listeners
    }
  },
  computed: {
    attrs () {
      return {
        ...omit(this.$props,
          'selectOnFocus', 'fitContent', 'resizable',
          ...(this.type === 'textarea' ? ['type'] : ['rows', 'composition'])
        ),
        name: this.realName,
        disabled: this.realDisabled,
        readonly: this.realReadonly
      }
    }
  },
  watch: {
    value (val) {
      this.localValue = val
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
    handleTextareaChange (value, event) {
      this.$emit('change', value, event)
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

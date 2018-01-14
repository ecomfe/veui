<template>
<div class="veui-textarea" :class="{
    'veui-textarea-focused': focused,
    'veui-textarea-rows': normalizedRows > 0,
    'veui-readonly': realReadonly,
    'veui-disabled': realDisabled
  }" :ui="ui">
  <div v-if="lineNumber" ref="measurer" class="veui-textarea-measurer">
    <div class="veui-textarea-measurer-line" v-for="(line, index) in lines" :key="index">
      <div class="veui-textarea-measurer-line-number" :style="{
        width: `${lineNumberWidth}px`
      }">{{ index + 1 }}</div>
      <div class="veui-textarea-measurer-line-content" aria-hidden="true">{{ line }}</div>
    </div>
  </div>
  <textarea ref="input" class="veui-textarea-input" v-model="localValue" :style="lineNumber ? {
      width: `calc(100% - ${lineNumberWidth}px)`
    } : null"
    v-bind="attrs"
    v-on="listeners"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="handleInput"
    @scroll="syncScroll"
    @change="$emit('change', $event.target.value, $event)"
  ></textarea>
</div>
</template>

<script>
import { pick } from 'lodash'
import { input } from '../mixins'

export default {
  name: 'veui-textarea',
  mixins: [input],
  props: {
    ui: String,
    placeholder: String,
    value: {
      type: String,
      default: ''
    },
    lineNumber: Boolean,
    rows: [Number, String],
    autofocus: Boolean,
    selectOnFocus: Boolean,
    composition: Boolean,
    resizable: Boolean,
    fitContent: Boolean
  },
  data () {
    let listeners = ['click', 'keyup', 'keydown', 'keypress'].reduce((acc, type) => {
      acc[type] = event => {
        this.$emit(type, event)
      }
      return acc
    }, {})
    return {
      localValue: this.value,
      focused: false,
      listeners
    }
  },
  computed: {
    normalizedRows () {
      let rows = Number(this.rows)
      return isNaN(rows) ? null : rows
    },
    attrs () {
      return {
        ...pick(this, 'placeholder', 'autofocus'),
        rows: this.normalizedRows,
        disabled: this.realDisabled,
        readonly: this.realReadonly
      }
    },
    lines () {
      // use a zero-width space to prevent empty element from being collapsed
      return this.localValue.split('\n').map(line => line || `\u200b${line}`)
    },
    digits () {
      const log10 = Math.log10 || function (x) {
        return Math.log(x) * Math.LOG10E
      }
      return Math.floor(log10(this.lines.length)) + 1
    },
    lineNumberWidth () {
      return this.digits * 8 + 12
    }
  },
  watch: {
    value (val) {
      this.localValue = val
    }
  },
  methods: {
    handleFocus (e) {
      this.focused = true
      this.$emit('focus', e)
    },
    handleBlur (e) {
      this.focused = false
      this.$emit('blur', e)
    },
    syncScroll () {
      if (!this.lineNumber) {
        return
      }
      let {
        input,
        measurer
      } = this.$refs
      this.$nextTick(() => {
        measurer.scrollTop = input.scrollTop
      })
    },
    handleInput ($event) {
      // 分3种情况
      // 1. 感知输入法，触发原生 input 事件就必须向上继续抛出
      // 2. 不感知输入法
      //  2.1 vue 底层会对原生 input 的 v-model 做忽略输入法组合态处理，所以 localValue 和 $event.target.value 不同步，只有当 localValue 产生变化时才向上继续抛出
      //  2.2 在 localValue 没有变化的情况下，原则上不抛出
      if (this.composition || !this.composition && this.localValue !== this.value) {
        this.$emit('input', $event.target.value, $event)
      }
      this.syncScroll()
    },
    focus () {
      this.$refs.input.focus()
    },
    activate () {
      this.$refs.input.focus()
    }
  }
}
</script>

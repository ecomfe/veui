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
  } : null" v-bind="attrs"
  @scroll="sync" @focus="focused = true" @blur="focused = false"></textarea>
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
    return {
      localValue: this.value,
      focused: false
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
    localValue (val) {
      if (this.value !== val) {
        this.$emit('input', val)
      }
      this.sync()
    },
    value (val) {
      if (this.localValue !== val) {
        this.localValue = val
      }
    }
  },
  methods: {
    sync () {
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
    }
  }
}
</script>

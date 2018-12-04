<template>
<div
  class="veui-textarea"
  :class="{
    'veui-textarea-focused': focused,
    'veui-textarea-rows': normalizedRows > 0,
    'veui-textarea-line-numbered': lineNumber,
    'veui-input-invalid': realInvalid,
    'veui-readonly': realReadonly,
    'veui-disabled': realDisabled
  }"
  :ui="realUi"
>
  <div
    v-if="measure"
    ref="measurer"
    class="veui-textarea-measurer"
  >
    <div
      v-for="(line, index) in lines"
      :key="index"
      class="veui-textarea-measurer-line"
    >
      <!-- eslint-disable vue/multiline-html-element-content-newline -->
      <div
        v-if="lineNumber"
        class="veui-textarea-measurer-line-number"
        :style="{width: `${lineNumberWidth}px`}"
      >{{ index + 1 }}</div>
      <div
        class="veui-textarea-measurer-line-content"
        aria-hidden="true"
        :style="{width: `${measurerContentWidth}px`}"
      >{{ line }}</div>
      <!-- eslint-ensable vue/multiline-html-element-content-newline -->
    </div>
  </div>
  <textarea
    ref="input"
    v-model="localValue"
    class="veui-textarea-input"
    :style="{
      maxWidth: lineNumber ? null : '100%',
      width: lineNumber ? `calc(100% - ${lineNumberWidth}px)` : null,
      height: contentHeight || null,
      // autoresize 的时候 hidden 一下，避免闪现一下滚动条。
      overflow: autoresize ? 'hidden' : 'auto'
    }"
    v-bind="attrs"
    v-on="listeners"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="handleInput"
    @scroll="handleScroll"
    @change="$emit('change', $event.target.value, $event)"
  />
</div>
</template>

<script>
import { pick } from 'lodash'
import ui from '../mixins/ui'
import input from '../mixins/input'
import { getListeners } from '../utils/helper'
import { log10 } from '../utils/math'

const EVENTS = ['click', 'keyup', 'keydown', 'keypress']

export default {
  name: 'veui-textarea',
  mixins: [ui, input],
  props: {
    placeholder: String,
    value: {
      type: String,
      default: ''
    },
    lineNumber: Boolean,
    rows: [Number, String],
    autofocus: Boolean,
    composition: Boolean,
    autoresize: Boolean
  },
  data () {
    return {
      localValue: this.value || '',
      focused: false,
      height: 0,
      measurerContentWidth: 0,
      measurerContentHeight: 0,
      scrollTop: 0
    }
  },
  computed: {
    listeners () {
      return getListeners(EVENTS, this)
    },
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
    measure () {
      return this.lineNumber || this.autoresize
    },
    lines () {
      // use a zero-width space to prevent empty element from being collapsed
      return this.localValue.split('\n').map(line => line || `\u200b${line}`)
    },
    digits () {
      return Math.floor(log10(this.lines.length)) + 1
    },
    lineNumberWidth () {
      return this.digits * 8 + 12
    },
    contentHeight () {
      if (this.autoresize) {
        return `${this.measurerContentHeight}px`
      }

      return null
    }
  },
  watch: {
    value (val) {
      this.localValue = val || ''
    },
    localValue: {
      handler () {
        if (!this.measure) {
          return
        }
        this.$nextTick(() => {
          if (this.$refs.input) {
            this.measurerContentWidth = this.$refs.input.clientWidth

            if (this.autoresize) {
              this.measurerContentHeight = this.getMeasurersHeight()
            }
          }
        })
      },
      immediate: true
    }
  },
  updated () {
    this.$nextTick(() => this.syncScroll())
  },
  mounted () {
    this.scrollTop = this.$refs.input.scrollTop
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
    getLineHeight (elem) {
      let computedStyle = getComputedStyle(elem)
      let lineHeight = parseFloat(computedStyle.lineHeight)
      if (isNaN(lineHeight)) {
        lineHeight = parseFloat(computedStyle.fontSize) * 1.2
      }
      return lineHeight
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

      this.$nextTick(() => {
        let { input } = this.$refs
        let inputLineHeight = this.getLineHeight(input)
        if (input.scrollHeight - input.clientHeight - input.scrollTop < inputLineHeight) {
          this.scrollTop = input.scrollHeight - input.clientHeight
        }
      })
    },
    focus () {
      this.$refs.input.focus()
    },
    activate () {
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.$refs.input.focus()
    },
    getMeasurersHeight () {
      return this.$refs.measurer.offsetHeight
    },
    handleScroll () {
      if (!this.measure) {
        return
      }
      this.scrollTop = this.$refs.input.scrollTop
      // render 里面没有依赖 scrollTop ，单独改 scrollTop 并不会触发 updated hook ，
      // 所以手动去同步一下 scrollTop
      this.syncScroll()
    },
    syncScroll () {
      let { input, measurer } = this.$refs
      input.scrollTop = this.scrollTop
      if (measurer) {
        measurer.scrollTop = this.scrollTop
      }
    }
  }
}
</script>

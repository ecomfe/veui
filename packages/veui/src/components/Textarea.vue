<template>
<div class="veui-textarea" :class="{
    'veui-textarea-focused': focused,
    'veui-textarea-rows': normalizedRows > 0,
    'veui-readonly': realReadonly,
    'veui-disabled': realDisabled
  }" :ui="ui">
  <div v-if="lineNumber" ref="measurer" class="veui-textarea-measurer"></div>
  <textarea ref="input" class="veui-textarea-input" v-model="localValue" :style="{
      width: lineNumber ? `calc(100% - ${lineNumberWidth}px)` : null,
      // autoresize 的时候 hidden 一下，避免闪现一下滚动条。
      overflow: autoresize ? 'hidden' : 'auto'
    }"
    v-bind="attrs"
    v-on="listeners"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="handleInput"
    @scroll="syncScrollAndHeight(true)"
    @change="$emit('change', $event.target.value, $event)"
  ></textarea>
</div>
</template>

<script>
import { pick } from 'lodash'
import input from '../mixins/input'

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
    autoresize: Boolean
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
      height: 0,
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
    },
    focus () {
      this.$refs.input.focus()
    },
    activate () {
      this.$refs.input.focus()
    },
    generateMeasureHTML () {
      return this.lines.map((line, index) => {
        return [
          /* eslint-disable indent */
          '<div class="veui-textarea-measurer-line">',
            '<div ',
              'class="veui-textarea-measurer-line-number"',
              `style="width:${this.lineNumberWidth}px">${index + 1}</div>`,
            '<div ',
              'class="veui-textarea-measurer-line-content"',
              'aria-hidden="true"',
              `style="width:${this.$refs.input.clientWidth}px">${line}</div>`,
          '</div>'
          /* eslint-enable indent */
        ].join('')
      }).join('')
    },
    /**
     * 同步 measure 和 textarea 的 scrollHeight 和 scrollTop
     *
     * @param {boolean} isFromScrollEvent 是否由滚动事件直接触发
     */
    syncScrollAndHeight (isFromScrollEvent = false) {
      let { input, measurer } = this.$refs
      if (!input || !measurer) {
        return
      }

      if (this.autoresize) {
        // IE9 下面，首次获取到的 scrollHeight 是 line-height
        input.style.height = `${Math.max(input.clientHeight, input.scrollHeight)}px`
      }

      // 如果当前在最后一行，按 enter 键的时候，会触发滚动条 scrollTop 变化，
      // 但是 chrome 并不会将 scrollTop 滚动到最大值处，所以这里帮一把。
      if (
        !isFromScrollEvent &&
        input.scrollHeight - input.scrollTop - input.clientHeight < this.getLineHeight(input)
      ) {
        input.scrollTop = input.scrollHeight - input.clientHeight
      }

      // 在这里自己去生成 html 内容，主要是为了方便设置 scrollTop ，
      // 不然在高度不够的情况下，设置的 scrollTop 会被浏览器重置为一个“最大值”。
      measurer.innerHTML = this.generateMeasureHTML()
      measurer.scrollTop = input.scrollTop
    }
  },
  updated () {
    this.syncScrollAndHeight()
  },
  mounted () {
    this.syncScrollAndHeight()
  }
}
</script>

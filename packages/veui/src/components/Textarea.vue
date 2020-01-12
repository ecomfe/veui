<template>
<div
  :class="{
    [$c('textarea')]: true,
    [$c('focus')]: focused,
    [$c('textarea-rows')]: realRows > 0,
    [$c('textarea-line-numbered')]: lineNumber,
    [$c('textarea-autoresize')]: realAutoresize,
    [$c('textarea-resizable')]: resizable,
    [$c('invalid')]: realInvalid || lengthOverflow,
    [$c('readonly')]: realReadonly,
    [$c('disabled')]: realDisabled
  }"
  :ui="realUi"
  v-on="containerListeners"
>
  <div
    v-if="measure"
    ref="measurer"
    aria-hidden="true"
    :class="$c('textarea-measurer')"
  >
    <div
      v-for="(line, index) in lines"
      :key="index"
      :class="$c('textarea-measurer-line')"
    >
      <!-- eslint-disable vue/multiline-html-element-content-newline -->
      <div
        v-if="lineNumber"
        :class="$c('textarea-measurer-line-number')"
        :style="{ width: `${lineNumberWidth}px` }"
      >
        {{ index + 1 }}
      </div>
      <div
        :class="$c('textarea-measurer-line-content')"
        aria-hidden="true"
        :style="{ width: `${measurerContentWidth}px` }"
      >
        <span style="box-shadow: transparent 0 0;">{{ line }}</span>
      </div>
      <!-- eslint-ensable vue/multiline-html-element-content-newline -->
    </div>
  </div>
  <textarea
    ref="input"
    v-model="localValue"
    :class="$c('textarea-input')"
    :style="inputStyle"
    :placeholder="placeholder"
    v-bind="attrs"
    v-on="inputListeners"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="handleInput"
    @scroll="handleScroll"
    @change="$emit('change', $event.target.value, $event)"
  />
  <span
    v-if="realMaxlength !== null"
    ref="count"
    :class="{
      [$c('textarea-count')]: true,
      [$c('textarea-count-overflow')]: lengthOverflow
    }"
  >
    {{ length }}/{{ realMaxlength }}
  </span>
</div>
</template>

<script>
import { pick } from 'lodash'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import activatable from '../mixins/activatable'
import { log10 } from '../utils/math'
import { normalizeInt } from '../utils/helper'
import {
  getAbsoluteLineHeight,
  MOUSE_EVENTS,
  KEYBOARD_EVENTS,
  FOCUS_EVENTS
} from '../utils/dom'

export default {
  name: 'veui-textarea',
  mixins: [prefix, ui, input, activatable],
  inheritAttrs: false,
  props: {
    placeholder: String,
    value: {
      type: String,
      default: ''
    },
    lineNumber: Boolean,
    rows: [Number, String],
    selectOnFocus: Boolean,
    composition: Boolean,
    autoresize: Boolean,
    resizable: Boolean,
    maxlength: [Number, String],
    strict: Boolean
  },
  data () {
    return {
      localValue: this.value || '',
      focused: false,
      height: 0,
      measurerContentWidth: 0,
      measurerContentHeight: 0,
      scrollTop: 0,
      rowsHeight: null,
      originalPadding: null,
      lineHeight: 0,
      countOverlap: false
    }
  },
  computed: {
    realMaxlength () {
      return normalizeInt(this.maxlength)
    },
    realRows () {
      return normalizeInt(this.rows)
    },
    attrs () {
      return {
        ...this.$attrs,
        maxlength: this.strict ? this.realMaxlength : null,
        rows: this.realRows,
        disabled: this.realDisabled,
        readonly: this.realReadonly
      }
    },
    inputListeners () {
      return pick(this.$listeners, [...KEYBOARD_EVENTS, ...FOCUS_EVENTS])
    },
    realAutoresize () {
      return this.autoresize && !this.resizable
    },
    containerListeners () {
      return pick(this.$listeners, MOUSE_EVENTS)
    },
    measure () {
      return (
        this.lineNumber || this.realAutoresize || this.realMaxlength !== null
      )
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
      if (this.realAutoresize) {
        return `${this.measurerContentHeight}px`
      }

      return `${this.rowsHeight}px`
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
    },
    inputStyle () {
      let style = {
        maxWidth: this.lineNumber ? null : '100%',
        width: this.lineNumber
          ? `calc(100% - ${this.lineNumberWidth}px)`
          : null,
        height: this.contentHeight || null,
        // autoresize 的时候 hidden 一下，避免闪现一下滚动条。
        overflow: this.realAutoresize ? 'hidden' : 'auto'
      }

      if (this.countOverlap) {
        style.paddingBottom = `${this.originalPadding + this.lineHeight}px`
      }
      return style
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

            if (this.realAutoresize) {
              this.measurerContentHeight = this.getMeasurersHeight()
            }
          }

          if (this.realMaxlength !== null) {
            this.checkCountOverlap()
          }
        })
      },
      immediate: true
    },
    countOverlap (val) {
      if (!val) {
        return
      }

      let { input } = this.$refs
      console.log(input.scrollTop, input.scrollHeight)
      if (input.value.length === input.selectionStart) {
        // at the end
        setTimeout(() => {
          input.scrollTop = input.scrollHeight
        })
      }
    }
  },
  updated () {
    this.$nextTick(() => this.syncScroll())
  },
  mounted () {
    let { input } = this.$refs
    this.lineHeight = getAbsoluteLineHeight(input)
    this.scrollTop = this.$refs.input.scrollTop
    this.rowsHeight = this.getRowsHeight()
    this.originalPadding = parseFloat(getComputedStyle(input).paddingBottom)
  },
  methods: {
    getRowsHeight () {
      if (!this.realRows) {
        return null
      }
      let { input } = this.$refs
      let lineHeight = this.lineHeight
      let {
        borderTopWidth,
        paddingTop,
        paddingBottom,
        borderBottomWidth
      } = getComputedStyle(input)

      return (
        this.realRows * lineHeight +
        [borderTopWidth, paddingTop, paddingBottom, borderBottomWidth]
          .map(val => parseFloat(val))
          .reduce((acc, cur) => acc + cur, 0)
      )
    },
    isCountOverlap () {
      let { measurer, input, count } = this.$refs
      let lines = [
        ...measurer.querySelectorAll(
          `.${this.$c('textarea-measurer-line-content')}`
        )
      ]
      // there will be at lease one line
      let rects = lines[lines.length - 1].querySelector('span').getClientRects()
      let rect = rects[rects.length - 1]

      let { paddingLeft, paddingRight } = getComputedStyle(input)
      let pl = parseFloat(paddingLeft)
      let pr = parseFloat(paddingRight)

      let { marginLeft } = getComputedStyle(count)
      let mr = parseFloat(marginLeft)

      return pl + rect.width + mr + count.offsetWidth + pr > input.clientWidth
    },
    checkCountOverlap () {
      this.countOverlap = this.isCountOverlap()
    },
    handleFocus ($event) {
      this.focused = true

      if (this.realSelectOnFocus && $event.target) {
        $event.target.select()
      }
    },
    handleBlur () {
      this.focused = false
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
      if (
        this.composition ||
        (!this.composition && this.localValue !== this.value)
      ) {
        this.$emit('input', $event.target.value, $event)
      }

      this.$nextTick(() => {
        let { input } = this.$refs
        if (!input) {
          return
        }
        let inputLineHeight = this.getLineHeight(input)
        if (
          input.scrollHeight - input.clientHeight - input.scrollTop <
          inputLineHeight
        ) {
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
      this.focus()
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

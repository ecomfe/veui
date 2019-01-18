<template>
<div class="veui-color-value-alpha">
  <div class="veui-color-value">
    <veui-input
      ref="alphaValue"
      v-nudge
      type="text"
      :value="alphaPercentage"
      :readonly="readonly"
      @input="handleValueInput"
      @keyup.up.down.native="handleValueInput($event.target.value)"
      @blur="handleValueBlur"
    />
  </div>
</div>
</template>

<script>
import { clamp } from 'lodash'
import ColorValueInput from './mixins/_ColorValueInput'

export default {
  name: 'color-value-alpha',
  mixins: [ColorValueInput],
  props: {
    alpha: Number,
    percentage: Boolean
  },
  computed: {
    alphaPercentage () {
      return Math.round(this.alpha * 100) + (this.percentage ? '%' : '')
    },
    matchRegexp () {
      return this.percentage ? /^\d+(\.\d+)?%$/ : /^\d+(\.\d+)?$/
    }
  },
  methods: {
    handleValueInput (val) {
      // console.log(val)
      if (!this.matchRegexp.test(val)) {
        return
      }
      this.updateAlphaValue(clamp(parseFloat(val) / 100 || 1, 0, 1))
    },
    handleValueBlur () {
      // 如果输入的值不合法就不触发事件，但希望能把输入框里的非法值改成当前的正确值，所以就这个处理下
      this.$refs.alphaValue.$refs.input.value = this.alphaPercentage
    }
  }
}
</script>

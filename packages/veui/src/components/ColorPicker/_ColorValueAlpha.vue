<template>
<div class="veui-color-value-alpha">
  <div class="veui-color-value">
    <veui-input
      ref="alphaValue"
      v-nudge
      type="text"
      :value="localValue"
      :readonly="readonly"
      @input="handleValueInput"
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
    alpha: Number
  },
  data () {
    return {
      localValue: null
    }
  },
  computed: {
    alphaPercentage () {
      return Math.round(this.alpha * 100) + '%'
    }
  },
  watch: {
    alpha: {
      handler (val) {
        this.localValue = Math.round(val * 100) + '%'
      },
      immediate: true
    }
  },
  methods: {
    handleValueInput (val) {
      this.localValue = val
      if (!/^\d+(\.\d+)?%$/.test(val)) {
        return
      }
      this.updateAlphaValue(clamp(parseFloat(this.localValue) / 100, 0, 1))
    },
    handleValueBlur () {
      if (this.alphaPercentage !== this.localValue) {
        this.localValue = this.alphaPercentage
      }
    }
  }
}
</script>

<template>
<div class="veui-color-value-hex">
  <div class="veui-color-value">
    <veui-color-value-input
      :value="hexValue"
      :readonly="readonly"
      :parse="parseHexValue"
      @input="handleValueInput"
    />
  </div>
</div>
</template>

<script>
import tinycolor from 'tinycolor2'
import ColorValueInput from './mixins/_ColorValueInput'

export default {
  name: 'color-value-hex',
  mixins: [ColorValueInput],
  computed: {
    hexValue () {
      return tinycolor(this.rgb).toHexString()
    }
  },
  methods: {
    handleValueInput (val) {
      this.updateColor(tinycolor(val).toRgb())
    }
  }
}
</script>

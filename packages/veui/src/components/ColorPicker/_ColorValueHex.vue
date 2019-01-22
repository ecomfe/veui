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
  props: {
    hue: Number,
    saturation: Number,
    brightness: Number
  },
  computed: {
    hexValue () {
      return tinycolor({
        h: this.hue,
        s: this.saturation,
        v: this.brightness
      }).toHexString()
    }
  },
  methods: {
    handleValueInput (val) {
      this.updateHsvValue(tinycolor(val).toHsv())
    }
  }
}
</script>

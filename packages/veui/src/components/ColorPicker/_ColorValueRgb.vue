<template>
<div class="veui-color-value-rgb">
  <div class="veui-color-value">
    <veui-color-value-input
      :value="rgb.r"
      :readonly="readonly"
      :parse="parseFFValue"
      nudge="ff"
      @input="handleRedValueInput"
    />
  </div>

  <div class="veui-color-value">
    <veui-color-value-input
      :value="rgb.g"
      :readonly="readonly"
      :parse="parseFFValue"
      nudge="ff"
      @input="handleGreenValueInput"
    />
  </div>

  <div class="veui-color-value">
    <veui-color-value-input
      :value="rgb.b"
      :readonly="readonly"
      :parse="parseFFValue"
      nudge="ff"
      @input="handleBlueValueInput"
    />
  </div>
</div>
</template>

<script>
import tinycolor from 'tinycolor2'
import ColorValueInput from './mixins/_ColorValueInput'

export default {
  name: 'color-value-rgb',
  mixins: [ColorValueInput],
  props: {
    hue: Number,
    saturation: Number,
    brightness: Number
  },
  computed: {
    rgb () {
      return tinycolor({
        h: this.hue,
        s: this.saturation,
        v: this.brightness
      }).toRgb()
    }
  },
  methods: {
    handleRedValueInput (val) {
      this.updateHsvValue(tinycolor(Object.assign({}, this.rgb, { r: val })).toHsv())
    },
    handleGreenValueInput (val) {
      this.updateHsvValue(tinycolor(Object.assign({}, this.rgb, { g: val })).toHsv())
    },
    handleBlueValueInput (val) {
      this.updateHsvValue(tinycolor(Object.assign({}, this.rgb, { b: val })).toHsv())
    }
  }
}
</script>

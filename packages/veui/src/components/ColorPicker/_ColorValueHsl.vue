<template>
<div class="veui-color-value-hsl">
  <div class="veui-color-value">
    <veui-color-value-input
      :value="hsl.h"
      :readonly="readonly"
      :format="formatHue"
      :parse="parseHue"
      nudge="hue"
      @input="handleHueValueInput"
    />
  </div>
  <div class="veui-color-value">
    <veui-color-value-input
      :value="hsl.s"
      :readonly="readonly"
      :format="formatPercentage"
      :parse="parsePercentage"
      nudge="percentage"
      @input="handleSaturationValueInput"
    />
  </div>
  <div class="veui-color-value">
    <veui-color-value-input
      :value="hsl.l"
      :readonly="readonly"
      :format="formatPercentage"
      :parse="parsePercentage"
      nudge="percentage"
      @input="handleLightnessValueInput"
    />
  </div>
</div>
</template>

<script>
import tinycolor from 'tinycolor2'
import ColorValueInput from './mixins/_ColorValueInput'

export default {
  name: 'color-value-hsl',
  mixins: [ColorValueInput],
  props: {
    hue: Number,
    saturation: Number,
    brightness: Number
  },
  computed: {
    hsl () {
      return tinycolor({
        h: this.hue,
        s: this.saturation,
        v: this.brightness
      }).toHsl()
    }
  },
  methods: {
    handleHueValueInput (val) {
      this.updateHsvValue({
        h: val,
        s: this.saturation,
        v: this.brightness
      })
    },
    handleSaturationValueInput (val) {
      this.updateHsvValue({
        h: this.hue,
        s: val,
        v: this.brightness
      })
    },
    handleLightnessValueInput (val) {
      this.updateHsvValue(
        tinycolor({
          h: this.hue,
          s: this.saturation,
          l: val
        }).toHsv()
      )
    }
  }
}
</script>

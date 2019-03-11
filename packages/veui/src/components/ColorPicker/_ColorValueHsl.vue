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
import ColorValueInput from './mixins/_ColorValueInput'

export default {
  name: 'color-value-hsl',
  mixins: [ColorValueInput],
  methods: {
    handleHueValueInput (val) {
      this.updateColor({h: val})
    },
    handleSaturationValueInput (val) {
      this.updateColor({s: val})
    },
    handleLightnessValueInput (val) {
      this.updateColor({l: val})
    }
  }
}
</script>

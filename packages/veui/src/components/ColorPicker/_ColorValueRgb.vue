<template>
<div class="veui-color-value-rgb">
  <div class="veui-color-value">
    <veui-input
      ref="redValue"
      v-nudge.nodecimals
      type="text"
      :value="rgb.r"
      :readonly="readonly"
      @input="handleRedValueInput"
      @blur="handleValueBlur"
      @keyup.up.down.native="handleRedValueInput($event.target.value)"
    />
  </div>

  <div class="veui-color-value">
    <veui-input
      ref="greenValue"
      v-nudge.nodecimals
      type="text"
      :value="rgb.g"
      :readonly="readonly"
      @input="handleGreenValueInput"
      @blur="handleValueBlur"
      @keyup.up.down.native="handleGreenValueInput($event.target.value)"
    />
  </div>

  <div class="veui-color-value">
    <veui-input
      ref="blueValue"
      v-nudge.nodecimals
      type="text"
      :value="rgb.b"
      :readonly="readonly"
      @input="handleBlueValueInput"
      @blur="handleValueBlur"
      @keyup.up.down.native="handleBlueValueInput($event.target.value)"
    />
  </div>
</div>
</template>

<script>
import tinycolor from 'tinycolor2'
import { clamp } from 'lodash'
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
      val = clamp(parseInt(val, 10), 0, 255)
      if (isNaN(val)) {
        return
      }
      // 跟 ShadeField 一样的问题，要一起往外传
      this.updateHsvValue(
        tinycolor(Object.assign({}, this.rgb, { r: val })).toHsv()
      )
    },
    handleGreenValueInput (val) {
      val = clamp(parseInt(val, 10), 0, 255)
      if (isNaN(val)) {
        return
      }
      this.updateHsvValue(
        tinycolor(Object.assign({}, this.rgb, { g: val })).toHsv()
      )
    },
    handleBlueValueInput (val) {
      val = clamp(parseInt(val, 10), 0, 255)
      if (isNaN(val)) {
        return
      }
      this.updateHsvValue(
        tinycolor(Object.assign({}, this.rgb, { b: val })).toHsv()
      )
    },
    handleValueBlur () {
      this.$refs.redValue.$refs.input.value = this.rgb.r
      this.$refs.greenValue.$refs.input.value = this.rgb.g
      this.$refs.blueValue.$refs.input.value = this.rgb.b
    }
  }
}
</script>

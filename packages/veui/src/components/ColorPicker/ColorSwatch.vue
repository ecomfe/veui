<template>
<div class="veui-color-swatch" :ui="ui">
  <div class="veui-color-swatch-box">
    <div class="veui-color-swatch-box-bg">
      <div :style="{'background-color': color}"></div>
    </div>
  </div>
  <div class="veui-color-swatch-color" v-if="uiProps.format">
    <component :is="'veui-color-value-' + uiProps.format"
      :hue="hsva.h"
      :saturation="hsva.s"
      :brightness="hsva.v"
      :readonly="readonly"
    ></component>
  </div>
  <div class="veui-color-swatch-alpha" v-if="uiProps.channel">
    <div>透明度</div>
    <veui-color-value-alpha
      :alpha="hsva.a"
      :readonly="readonly"
    ></veui-color-value-alpha>
    <div>%</div>
  </div>
</div>
</template>

<script>
import tinycolor from 'tinycolor2'
import ValueHsl from './_ColorValueHsl'
import ValueRgb from './_ColorValueRgb'
import ValueHex from './_ColorValueHex'
import ValueAlpha from './_ColorValueAlpha'
import ui from '../../mixins/ui'
import ColorHomer from './mixins/_ColorHomer'

export default {
  name: 'ColorSwatch',
  components: {
    'veui-color-value-hsl': ValueHsl,
    'veui-color-value-rgb': ValueRgb,
    'veui-color-value-hex': ValueHex,
    'veui-color-value-alpha': ValueAlpha
  },
  mixins: [
    ui,
    ColorHomer
  ],
  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hsva () {
      let colors = tinycolor(this.color).toHsv()
      return Object.keys(colors).reduce(function (obj, key) {
        obj[key] = Math.round(colors[key] * 100) / 100
        return obj
      }, {})
    }
  }
}
</script>

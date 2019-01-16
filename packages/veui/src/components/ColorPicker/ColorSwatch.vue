<template>
<div class="veui-color-swatch" :ui="ui">
  <div class="veui-color-swatch-box">
    <div class="veui-color-swatch-box-bg">
      <div :style="{'background-color': color}"></div>
    </div>
  </div>
  <veui-color-value-alpha-group
    v-bind="{
      ui,
      readonly,
      hue: hsva.h,
      saturation: hsva.s,
      brightness: hsva.v,
      alpha: hsva.a,
      switchable: !!uiProps.switchable,
      showTip: !!uiProps.tip,
      showAlpha: !!uiProps.alpha,
      variant: uiProps.format
    }"
  />
</div>
</template>

<script>
import tinycolor from 'tinycolor2'
import ValueAlphaGroup from './_ColorValueAlphaGroup'
import ui from '../../mixins/ui'
import ColorHomer from './mixins/_ColorHomer'

export default {
  name: 'ColorSwatch',
  components: {
    'veui-color-value-alpha-group': ValueAlphaGroup
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

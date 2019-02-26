<template>
<div
  class="veui-color-picker"
  :ui="realUi"
>
  <div class="veui-color-picker-main">
    <div class="veui-color-picker-main-panel">
      <veui-color-shade-field
        :width="shadeFieldSize[0]"
        :height="shadeFieldSize[1]"
        :ui="realUi"
        :color="color"
        :hsv="hsv"
      />
      <div class="veui-color-picker-main-panel-sliders">
        <veui-color-hue-slider :hsl="hsl"/>
        <veui-color-alpha-slider
          v-if="alpha"
          :hsl="hsl"
        />
      </div>
    </div>
    <veui-color-swatch
      v-if="uiProps.swatch"
      v-bind="{color, ui: realUi, switchable, alpha, variant}"
    />
  </div>
  <div class="veui-color-picker-extra">
    <slot/>
  </div>
</div>
</template>

<script>
import ColorSwatch from './ColorSwatch'
import ui from '../../mixins/ui'
import ColorHomer from './mixins/_ColorHomer'
import HueSlider from './_ColorHueSlider'
import AlphaSlider from './_ColorAlphaSlider'
import ShadeField from './_ColorShadeField'

export default {
  name: 'color-picker',
  components: {
    'veui-color-swatch': ColorSwatch,
    'veui-color-hue-slider': HueSlider,
    'veui-color-alpha-slider': AlphaSlider,
    'veui-color-shade-field': ShadeField
  },
  mixins: [ui, ColorHomer],
  computed: {
    shadeFieldSize () {
      return this.uiData.shadeFieldSize
    }
  }
}
</script>

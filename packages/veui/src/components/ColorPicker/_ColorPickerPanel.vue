<template>
<div class="veui-color-panel-standard">
  <veui-color-shade-field :width="200" :height="200"
    v-bind="{hue, saturation, brightness}"></veui-color-shade-field>

  <div class="veui-color-panel-standard-swatch">
    <veui-color-swatch :color="color"></veui-color-swatch>
    <div class="veui-color-panel-standard-sliders">
      <veui-color-hue-slider :value="hue" :direction="0"></veui-color-hue-slider>
      <veui-color-alpha-slider :value="alpha" :direction="0"></veui-color-alpha-slider>
    </div>
  </div>

  <veui-color-value-alpha-group v-bind="{hue, saturation, brightness, alpha}">
  </veui-color-value-alpha-group>
</div>
</template>

<script>
import ColorSwatch from './ColorSwatch'
import ValueAlphaGroup from './_ColorValueAlphaGroup'
import ColorPanel from './mixins/_ColorPanel'

export default {
  name: 'ColorPanel',
  mixins: [
    ColorPanel
  ],
  components: {
    'veui-color-swatch': ColorSwatch,
    'veui-color-value-alpha-group': ValueAlphaGroup
  }
}
</script>

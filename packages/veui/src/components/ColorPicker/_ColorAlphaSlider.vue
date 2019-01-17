<template>
<div class="veui-color-slider veui-color-alpha-slider">
  <veui-slider :min="0" :max="1" :step="0.01"
    :value="value" @input="updateAlphaValue" >
    <div class="veui-slider-custom-track" slot="track" :style="{
      background: `linear-gradient(to right,
        hsla(${hue}, ${saturation * 100}%,${brightness * 100}%, 0),
        hsla(${hue}, ${saturation * 100}%,${brightness * 100}%, 1))`
    }"></div>
    <div class="veui-slider-custom-thumb" slot="thumb"></div>
    <template slot="tip">&#8203;</template>
  </veui-slider>
</div>
</template>

<script>
import ColorSlider from './mixins/_ColorSlider'

export default {
  name: 'ColorAlphaSlider',
  mixins: [
    ColorSlider
  ],
  props: {
    hue: Number,
    saturation: Number,
    brightness: Number
  }
}
</script>

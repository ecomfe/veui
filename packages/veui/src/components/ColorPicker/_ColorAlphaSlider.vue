<template>
<div class="veui-color-slider veui-color-alpha-slider">
  <veui-slider
    :min="0"
    :max="1"
    :step="0.01"
    :value="value"
    @input="updateAlphaValue"
  >
    <div
      slot="track"
      class="veui-slider-custom-track"
      :style="{
        background: `linear-gradient(to right,
          hsla(${hue}, ${saturation * 100}%,${brightness * 100}%, 0),
          hsla(${hue}, ${saturation * 100}%,${brightness * 100}%, 1))`
      }"
    />
    <div
      slot="thumb"
      class="veui-slider-custom-thumb"
    />
    <template slot="tip">
      &#8203;
    </template>
  </veui-slider>
</div>
</template>

<script>
import ColorSlider from './mixins/_ColorSlider'

export default {
  name: 'color-alpha-slider',
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

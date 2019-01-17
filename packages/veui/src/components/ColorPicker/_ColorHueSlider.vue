<template>
<div class="veui-color-slider veui-color-hue-slider">
  <veui-slider :min="0" :max="360" :step="1"
    :value="value" @input="handleValueUpdate">
    <div class="veui-slider-custom-track" slot="track"></div>
    <div class="veui-slider-custom-thumb" slot="thumb"></div>
    <template slot="tip">&#8203;</template>
  </veui-slider>
</div>
</template>

<script>
import ColorSlider from './mixins/_ColorSlider'

export default {
  name: 'ColorHueSlider',
  mixins: [
    ColorSlider
  ],
  methods: {
    handleValueUpdate (val) {
      this.updateHsvValue({
        h: val
      })
    }
  }
}
</script>

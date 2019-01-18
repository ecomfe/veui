<template>
<div class="veui-color-slider veui-color-hue-slider">
  <veui-slider
    :min="0"
    :max="360"
    :step="1"
    :value="value"
    @input="handleValueUpdate"
  >
    <div
      slot="track"
      class="veui-slider-custom-track"
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
  name: 'color-hue-slider',
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

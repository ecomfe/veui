<template>
<div class="veui-color-slider veui-color-alpha-slider">
  <veui-slider
    :min="0"
    :max="1"
    :step="0.01"
    :value="hsl.a"
    @input="handleValueUpdate"
  >
    <div
      slot="track"
      class="veui-slider-custom-track"
      :style="{
        background: `linear-gradient(to right,
          hsla(${hsl.h}, ${hsl.s * 100}%,${hsl.l * 100}%, 0),
          hsla(${hsl.h}, ${hsl.s * 100}%,${hsl.l * 100}%, 1))`
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
  methods: {
    handleValueUpdate (val) {
      this.updateColor({
        a: val
      })
    }
  }
}
</script>

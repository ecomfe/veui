<template>
<div class="veui-color-alpha-slider">
  <VeuiColorPickerPrivateSlider :value="value" :direction="direction" v-bind="sliderSize"
    @update:value="updateAlphaValue"
    @dragstart="$emit('dragstart')"
    @dragend="$emit('dragend')">
    <div :style="{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1))'
    }"></div>
  </VeuiColorPickerPrivateSlider>
</div>
</template>

<script>
import ColorSlider from './mixins/ColorSlider'

export default {
  name: 'ColorAlphaSlider',
  mixins: [
    ColorSlider
  ]
}
</script>

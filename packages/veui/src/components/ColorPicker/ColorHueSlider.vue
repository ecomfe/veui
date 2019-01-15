<template>
<div class="veui-color-hue-slider">
  <VeuiColorPickerPrivateSlider :value="progress" :direction="direction" v-bind="sliderSize"
    @update:value="handleValueUpdate"
    @dragstart="$emit('dragstart')"
    @dragend="$emit('dragend')">
    <div :style="{
      width: '100%',
      height: '100%',
      background: `linear-gradient(to ${direction === 0 ? 'left' : 'right'}, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00)`
    }"></div>
  </VeuiColorPickerPrivateSlider>
</div>
</template>

<script>
import ColorSlider from './mixins/ColorSlider'

export default {
  name: 'ColorHueSlider',
  mixins: [
    ColorSlider
  ],
  computed: {
    progress () {
      let val = Math.min(1, Math.max(0, this.value / 360))
      // 水平方向上色相是 360 -> 0，垂直方向上是 0 -> 360，所以要区别处理
      return this.direction === 0 ? 1 - val : val
    }
  },
  methods: {
    handleValueUpdate (val) {
      let hue = (this.direction === 0 ? 1 - val : val) * 360
      this.updateHsvValue({
        h: hue
      })
    }
  }
}
</script>

<template>
<div class="veui-color-slider veui-color-hue-slider">
  <veui-slider
    :min="0"
    :max="360"
    :step="1"
    :value="localHue"
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
  data () {
    return {
      localHue: 0
    }
  },
  watch: {
    hsl: {
      handler ({h}) {
        // Hue 到了 360 时取余归零，为了避免滑块跳变，这里处理一下
        if (h || this.localHue % 360) {
          this.localHue = h
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleValueUpdate (val) {
      this.localHue = val
      this.updateColor({
        h: val % 360
      })
    }
  }
}
</script>

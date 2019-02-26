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
      :style="{ background: gradient }"
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
  computed: {
    gradient () {
      let { h, s, l } = this.hsl
      let from = `hsla(${h}, ${s * 100}%,${l * 100}%, 0)`
      let to = `hsla(${h}, ${s * 100}%,${l * 100}%, 1)`
      return [
        `url("data:image/svg+xml;utf8;<svg xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='a' x1='0%' y1='0%' y2='0%'><stop offset='0%' stop-color='${from}'/><stop offset='100%' stop-color='${to}'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23a)'/></svg>")`,
        `linear-gradient(to right, ${from}, ${to})`
      ]
    }
  },
  methods: {
    handleValueUpdate (val) {
      this.updateColor({
        a: val
      })
    }
  }
}
</script>

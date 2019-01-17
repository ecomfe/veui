<template>
<div class="veui-color-picker" :ui="ui">
  <div class="veui-color-picker-main">
    <div class="veui-color-picker-main-panel">
      <veui-color-shade-field
        :width="shadeFieldSize[0]"
        :height="shadeFieldSize[1]"
        :ui="ui"
        :hue="hsva.h"
        :saturation="hsva.s"
        :brightness="hsva.v"
        :alpha="hsva.a"
      />
      <div class="veui-color-picker-main-panel-sliders">
        <veui-color-hue-slider :value="hsva.h" />
        <veui-color-alpha-slider v-if="alpha"
          :hue="hsva.h" :saturation="hsva.s" :brightness="hsva.v"
          :value="hsva.a" />
      </div>
    </div>
    <veui-color-swatch v-if="uiProps.swatch" v-bind="{color, ui, switchable, alpha, variant}" />
  </div>
  <div class="veui-color-picker-extra">
    <slot></slot>
  </div>
</div>
</template>

<script>
import tinycolor from 'tinycolor2'
import ColorSwatch from './ColorSwatch'
import ui from '../../mixins/ui'
import ColorHomer from './mixins/_ColorHomer'
import HueSlider from './_ColorHueSlider'
import AlphaSlider from './_ColorAlphaSlider'
import ShadeField from './_ColorShadeField'
import config from 'veui/managers/config'

export default {
  name: 'ColorPicker',
  components: {
    'veui-color-swatch': ColorSwatch,
    'veui-color-hue-slider': HueSlider,
    'veui-color-alpha-slider': AlphaSlider,
    'veui-color-shade-field': ShadeField
  },
  mixins: [
    ui,
    ColorHomer
  ],
  data () {
    return {
      previousHsva: {},
      shadeFieldSizeMap: config.get('colorpicker.shadeFieldSize')
    }
  },
  computed: {
    shadeFieldSize() {
      return this.shadeFieldSizeMap[this.uiProps.size];
    },
    hsva () {
      let prevHsva = this.previousHsva
      let hsva = tinycolor(this.color).toHsv()

      // fix
      if (prevHsva.h % 360 === hsva.h % 360) {
        // 因为色相是 360度循环的，360 被 tinycolor 转换成了 0，直接用的话会导致滑块跳变，所以这个特殊处理下
        hsva.h = prevHsva.h
      }
      if (tinycolor.equals(hsva, prevHsva)) {
        // 连续纯黑色情况下(SaturationBrightnessField底部区域)，
        // 传出再传入的 hsv 不一样，导致信息丢失，这里恢复一下，不然取色圈会跳变
        // hsv(40, 0.001, 0.001) -> rgb(0, 0, 0) -> hsv(0, 0, 0)
        hsva.h = prevHsva.h
        hsva.s = prevHsva.s
      }
      if (hsva.s === 0 && prevHsva.s !== 0) {
        hsva.h = prevHsva.h
      }
      if (hsva.h === undefined) {
        hsva.h = prevHsva.h
      }

      if (!this.uiProps.alpha) {
        hsva.a = 1
      }

      return hsva
    }
  }
}
</script>

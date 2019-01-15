<template>
<div class="veui-color-picker" :ui="ui">
  123
  <div class="veui-color-picker-main">
    <div v-if="uiProps.size === 'large'">
      <veui-color-panel-large
        :hue="hsva.h"
        :saturation="hsva.s"
        :brightness="hsva.v"
        :alpha="hsva.a"
      ></veui-color-panel-large>
    </div>
    <div v-else-if="uiProps.size === 'small'">
      <veui-color-value-group
        :hue="hsva.h"
        :saturation="hsva.s"
        :brightness="hsva.v"
        :alpha="hsva.a"
      ></veui-color-value-group>
    </div>
    <div v-else>
      <veui-color-panel-standard
        :hue="hsva.h"
        :saturation="hsva.s"
        :brightness="hsva.v"
        :alpha="hsva.a"
      ></veui-color-panel-standard>
    </div>
  </div>
  <div class="veui-color-picker-extra">
    <slot></slot>
  </div>
</div>
</template>

<script>
import tinycolor from 'tinycolor2'
import ColorSwatch from './ColorSwatch'
import ValueGroup from './ColorValueGroup'
import ColorPanelLarge from './ColorPickerPanelLarge'
import ColorPanelStandard from './ColorPickerPanelStandard'
import ui from '../../mixins/ui'
import ColorHomer from './mixins/ColorHomer'

export default {
  name: 'ColorPicker',
  components: {
    'veui-color-swatch': ColorSwatch,
    'veui-color-panel-standard': ColorPanelStandard,
    'veui-color-panel-large': ColorPanelLarge,
    'veui-color-value-group': ValueGroup
  },
  mixins: [
    ui,
    ColorHomer
  ],
  data () {
    return {
      previousHsva: {}
    }
  },
  computed: {
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

      return hsva
    }
  }
}
</script>

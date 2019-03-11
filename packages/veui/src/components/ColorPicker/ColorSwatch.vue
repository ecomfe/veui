<template>
<div
  class="veui-color-swatch"
  :ui="realUi"
>
  <div class="veui-color-swatch-box">
    <div class="veui-color-swatch-box-bg">
      <div :style="{'background-color': color}"/>
    </div>
  </div>
  <veui-color-value-alpha-group
    v-bind="{
      ui,
      readonly,
      hsl,
      rgb,
      showTip: !!uiProps.tip,
      switchable,
      alphaChannel: alpha,
      variant
    }"
  />
</div>
</template>

<script>
import ValueAlphaGroup from './_ColorValueAlphaGroup'
import ui from '../../mixins/ui'
import ColorHomer from './mixins/_ColorHomer'

export default {
  name: 'color-swatch',
  components: {
    'veui-color-value-alpha-group': ValueAlphaGroup
  },
  mixins: [ui, ColorHomer],
  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  }
}
</script>

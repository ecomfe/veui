<template>
<div class="veui-color-value-group">
  <div class="veui-color-value-group-item veui-color-value-group-item-hex">
    <div class="veui-color-value-group-name">Hex</div>
    <veui-color-value-hex v-bind="{hue, saturation, brightness, readonly}"></veui-color-value-hex>
  </div>
  <div class="veui-color-value-group-item veui-color-value-group-item-rgb">
    <div class="veui-color-value-group-name">RGB</div>
    <veui-color-value-rgb v-bind="{hue, saturation, brightness, readonly}"></veui-color-value-rgb>
  </div>
</div>
</template>

<script>
import ColorValueGroup from './mixins/_ColorValueGroup'

export default {
  name: 'ColorValueGroup',
  mixins: [
    ColorValueGroup
  ]
}
</script>

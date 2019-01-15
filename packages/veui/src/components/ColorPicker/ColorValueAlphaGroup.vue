<template>
<div class="veui-color-value-alpha-group" :ui="variant">
  <div class="veui-color-value-alpha-group-values">
    <div class="veui-color-value-alpha-group-color">
      <component :is="'veui-color-value-' + variant"
        v-bind="{hue, saturation, brightness, readonly}"></component>
    </div>
    <div class="veui-color-value-alpha-group-separator" @click="toggleColorFormatVariant">
      <div class="veui-color-value-alpha-group-separator-dot"></div>
      <div class="veui-color-value-alpha-group-separator-dot"></div>
      <div class="veui-color-value-alpha-group-separator-dot"></div>
    </div>
    <div class="veui-color-value-alpha-group-alpha">
      <veui-color-value-alpha :percentage="true" v-bind="{alpha, readonly}">
      </veui-color-value-alpha>
    </div>
  </div>
  <div class="veui-color-value-alpha-group-text">
    <div class="veui-color-value-alpha-group-text-rgb" v-if="variant === 'rgb'">
      <div>R</div><div>G</div><div>B</div>
    </div>
    <div class="veui-color-value-alpha-group-text-hsl" v-else-if="variant === 'hsl'">
      <div>H</div><div>S</div><div>L</div>
    </div>
    <div class="veui-color-value-alpha-group-text-hex" v-else-if="variant === 'hex'">
      <div>HEX</div>
    </div>
    <div class="veui-color-value-alpha-group-text-alpha">
      <div>A</div>
    </div>
  </div>
</div>
</template>

<script>
import ColorValueGroup from './mixins/ColorValueGroup'

const variants = ['hex', 'rgb', 'hsl']

export default {
  name: 'ColorValueAlphaGroup',
  mixins: [
    ColorValueGroup
  ],
  data () {
    return {
      variant: 'rgb'
    }
  },
  methods: {
    toggleColorFormatVariant () {
      let i = variants.indexOf(this.variant)
      i = (i + 1) % variants.length
      this.variant = variants[i]
    }
  }
}
</script>

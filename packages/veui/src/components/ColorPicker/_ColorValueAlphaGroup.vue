<template>
<div class="veui-color-value-alpha-group" :class="{
  [`veui-color-value-alpha-group-format-${realVariant}`]: true,
  ['veui-color-value-alpha-group-show-tip']: showTip
}">
  <div class="veui-color-value-alpha-group-values">
    <div class="veui-color-value-alpha-group-color">
      <component :is="'veui-color-value-' + realVariant"
        v-bind="{hue, saturation, brightness, readonly}"></component>
    </div>
    <div class="veui-color-value-alpha-group-separator" v-if="switchable" @click="toggleColorFormatVariant">
      <div class="veui-color-value-alpha-group-separator-wrap">
        <div class="veui-color-value-alpha-group-separator-dots">
          <div class="veui-color-value-alpha-group-separator-dot"></div>
          <div class="veui-color-value-alpha-group-separator-dot"></div>
          <div class="veui-color-value-alpha-group-separator-dot"></div>
        </div>
      </div>
    </div>
    <div class="veui-color-value-alpha-group-alpha" v-if="alphaChannel">
      <veui-color-value-alpha :percentage="true" v-bind="{alpha, readonly}">
      </veui-color-value-alpha>
    </div>
  </div>
  <div class="veui-color-value-alpha-group-tip" v-if="showTip">
    <div class="veui-color-value-alpha-group-tip-rgb" v-if="realVariant === 'rgb'">
      <div>R</div><div>G</div><div>B</div>
    </div>
    <div class="veui-color-value-alpha-group-tip-hsl" v-else-if="realVariant === 'hsl'">
      <div>H</div><div>S</div><div>L</div>
    </div>
    <div class="veui-color-value-alpha-group-tip-hex" v-else-if="realVariant === 'hex'">
      <div>HEX</div>
    </div>
    <div class="veui-color-value-alpha-group-tip-alpha" v-if="alphaChannel">
      <div>A</div>
    </div>
  </div>
</div>
</template>

<script>
import ColorValueGroup from './mixins/_ColorValueGroup';

const variants = ['hex', 'rgb', 'hsl']

export default {
  name: 'ColorValueAlphaGroup',
  mixins: [ColorValueGroup],
  props: {
    switchable: Boolean,
    showTip: Boolean,
    alphaChannel: Boolean,
    variant: String
  },
  data () {
    return {
      realVariant: 'rgb'
    }
  },
  watch: {
    realVariant(val) {
      this.$emit('update:variant', val)
    },
    variant: {
      handler(val, oldVal) {
        if (this.realVariant !== val) {
          this.realVariant = val
        }
      },
      immediate: true
    }
  },
  methods: {
    toggleColorFormatVariant () {
      let i = variants.indexOf(this.realVariant)
      i = (i + 1) % variants.length
      this.realVariant = variants[i]
    }
  }
}
</script>

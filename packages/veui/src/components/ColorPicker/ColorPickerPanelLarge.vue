<template>
<div class="veui-color-panel-large">
  <veui-color-shade-field :width="220" :height="220"
    v-bind="{hue, saturation, brightness, alpha}"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  ></veui-color-shade-field>

  <veui-color-alpha-slider :value="alpha" :direction="1"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  ></veui-color-alpha-slider>

  <veui-color-hue-slider :value="hue" :direction="1"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  ></veui-color-hue-slider>

  <div class="veui-color-panel-large-color-diff">
    <div class="veui-color-panel-large-color-diff-text">新的</div>
    <div class="veui-color-panel-large-color-diff-color">
      <div :style="{
        'background-color': color
      }"></div>
      <div :style="{
        'background-color': previousColor || color
      }"></div>
    </div>
    <div class="veui-color-panel-large-color-diff-text">当前</div>
  </div>

  <veui-color-value-group v-bind="{hue, saturation, brightness}"></veui-color-value-group>
</div>
</template>

<script>
import ValueGroup from './ColorValueGroup'
import ColorPanel from './mixins/ColorPanel'

export default {
  name: 'ColorPanelLarge',
  mixins: [
    ColorPanel
  ],
  components: {
    'veui-color-value-group': ValueGroup
  },
  data () {
    return {
      previousColor: ''
    }
  },
  methods: {
    handleDragStart () {
      // 拖动前把当前颜色存一下用于显示
      this.previousColor = this.currentColor
    },
    handleDragEnd () {
      this.$nextTick(() => {
        this.previousColor = this.currentColor
      })
    }
  }
}
</script>

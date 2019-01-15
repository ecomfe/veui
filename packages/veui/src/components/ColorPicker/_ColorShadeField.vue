<template>
<div class="veui-color-shade-field" :style="{
  width: width + 'px',
  height: height + 'px'
}">
  <div class="veui-color-shade-field-shade" ref="field" @click="handleShadeFieldClick">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" v-bind="{width, height}">
      <defs>
        <linearGradient :id="'saturation-' + svgSuffix" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#fff" />
          <stop offset="100%" :stop-color="hueColor" />
        </linearGradient>
        <linearGradient :id="'brightness-' + svgSuffix" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000" stop-opacity="0" />
          <stop offset="100%" stop-color="#000" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" v-bind="{width, height}" :fill="`url(#saturation-${svgSuffix})`" />
      <rect x="0" y="0" v-bind="{width, height}" :fill="`url(#brightness-${svgSuffix})`" />
    </svg>
  </div>
  <div class="veui-color-shade-field-aperture" v-drag :style="{
    'background-color': color,
    transform: `translate(${aperturePosition.x - 6}px, ${aperturePosition.y - 6}px)`
  }" @click.stop></div>
</div>
</template>

<script>
import tinycolor from 'tinycolor2'
import {drag} from '../../directives'
import {clamp} from 'lodash'
import ColorUpdater from './mixins/_ColorUpdater'

export default {
  name: 'ColorShadeField',
  mixins: [
    ColorUpdater
  ],
  directives: {
    drag
  },
  props: {
    width: Number,
    height: Number,
    hue: Number,
    saturation: Number,
    brightness: Number
  },
  data () {
    return {
      isDragging: false,
      dragInitX: 0,
      dragInitY: 0
    }
  },
  computed: {
    svgSuffix () {
      // Chrome Document内多个 <svg> 内的 <defs> 定义的 id 是共享的，所以加个后缀防止冲突
      return Math.round(Math.random() * 0xFFFFFF).toString(36)
    },
    aperturePosition () {
      let saturation = this.saturation
      let brightness = this.brightness
      return {
        x: saturation * this.width,
        y: (1 - brightness) * this.height
      }
    },
    color () {
      return tinycolor({
        h: this.hue,
        s: this.saturation,
        v: this.brightness
      }).toHslString()
    },
    hueColor () {
      return tinycolor({
        h: this.hue,
        s: 1,
        v: 1
      }).toHexString()
    }
  },
  methods: {
    handleShadeFieldClick ({clientX, clientY, offsetX, offsetY}) {
      this.updateSatbri(offsetX / this.width, 1 - offsetY / this.height)
      this.$emit('dragend')
    },
    updateSatbri (saturation, brightness) {
      saturation = clamp(saturation, 0, 1)
      brightness = clamp(brightness, 0, 1)
      this.updateHsvValue({
        s: saturation,
        v: brightness
      })
    }
  },
  mounted () {
    this.$on('dragstart', () => {
      this.isDragging = true
      this.dragInitX = this.aperturePosition.x
      this.dragInitY = this.aperturePosition.y
    })
    this.$on('dragend', () => {
      this.isDragging = false
    })
    this.$on('drag', ({distanceX, distanceY}) => {
      let x = this.dragInitX + distanceX
      let y = this.dragInitY + distanceY
      // 得合在一起传出去(satlig=saturation+brightness)。因为要冒泡到 ColorPicker format成字符串再传回来
      // 如果分开的话，后一个到达 ColorPicker 的时候前一个还没生效，所以使用原来的值，导致前一个无法改变
      this.updateSatbri(x / this.width, 1 - y / this.height)
    })
  }
}
</script>

<template>
<div
  class="veui-color-shade-field"
  :style="{
    width: width + 'px',
    height: height + 'px'
  }"
>
  <div
    ref="field"
    class="veui-color-shade-field-shade"
    @click="handleShadeFieldClick"
  >
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      v-bind="{width, height}"
    >
      <defs>
        <linearGradient
          :id="'saturation-' + svgSuffix"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stop-color="#fff"
          />
          <stop
            offset="100%"
            :stop-color="hueColor"
          />
        </linearGradient>
        <linearGradient
          :id="'brightness-' + svgSuffix"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="#000"
            stop-opacity="0"
          />
          <stop
            offset="100%"
            stop-color="#000"
            stop-opacity="1"
          />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        v-bind="{width, height}"
        :fill="`url(#saturation-${svgSuffix})`"
      />
      <rect
        x="0"
        y="0"
        v-bind="{width, height}"
        :fill="`url(#brightness-${svgSuffix})`"
      />
    </svg>
  </div>
  <div
    v-drag
    class="veui-color-shade-field-aperture"
    :style="{
      'background-color': color,
      transform: `translate(${dragCurrentX - 6}px, ${dragCurrentY - 6}px)`
    }"
    @click.stop
  />
</div>
</template>

<script>
// import tinycolor from 'tinycolor2'
import {drag} from '../../directives'
import {clamp} from 'lodash'
import ColorUpdater from './mixins/_ColorUpdater'
import {getTypedAncestorTracker} from '../../utils/helper'

export default {
  name: 'color-shade-field',
  directives: {
    drag
  },
  mixins: [
    ColorUpdater,
    getTypedAncestorTracker('color-homer')
  ],
  props: {
    width: Number,
    height: Number,
    color: String,
    hsv: Object
  },
  data () {
    return {
      isDragging: false,

      dragInitX: 0,
      dragInitY: 0,
      dragCurrentX: 0,
      dragCurrentY: 0
    }
  },
  computed: {
    svgSuffix () {
      // Chrome Document内多个 <svg> 内的 <defs> 定义的 id 是共享的，所以加个后缀防止冲突
      return Math.round(Math.random() * 0xFFFFFF).toString(36)
    },
    aperturePosition () {
      let {s, v} = this.hsv
      return {
        x: s * this.width,
        y: (1 - v) * this.height
      }
    },
    hueColor () {
      return `hsl(${this.hsv.h}, 100%, 50%)`
    }
  },
  watch: {
    aperturePosition: {
      handler ({x, y}) {
        if (!this.isDragging) {
          this.dragCurrentX = x
          this.dragCurrentY = y
        }
      },
      immediate: true
    },
    isDragging (val) {
      // 如果拖到底下黑色那块儿，颜色出去转一圈回来 hue 变 0 了，呵呵，锁一下
      this.colorHomer.lockHue(val ? this.hsv.h : null)
    }
  },
  mounted () {
    this.$on('dragstart', () => {
      this.isDragging = true
      // 一开始没拖的时候还是要从颜色反推位置
      this.dragInitX = this.dragCurrentX === undefined ? this.aperturePosition.x : this.dragCurrentX
      this.dragInitY = this.dragCurrentY === undefined ? this.aperturePosition.y : this.dragCurrentY
    })
    this.$on('dragend', () => {
      this.isDragging = false
    })
    this.$on('drag', ({distanceX, distanceY}) => {
      let x = this.dragInitX + distanceX
      let y = this.dragInitY + distanceY

      // 底下黑色那一块儿颜色都糊在一起，从颜色算出来的坐标就很飘，还是用自己的位置比较稳
      this.dragCurrentX = clamp(x, 0, this.width)
      this.dragCurrentY = clamp(y, 0, this.height)

      // 得合在一起传出去(satlig=saturation+brightness)。因为要到 ColorPicker format成字符串再传回来
      // 如果分开的话，后一个到达 ColorPicker 的时候前一个还没生效，所以使用原来的值，导致前一个无法改变
      this.updateSatbri(x / this.width, 1 - y / this.height)
    })
  },
  methods: {
    handleShadeFieldClick ({clientX, clientY, offsetX, offsetY}) {
      this.updateSatbri(offsetX / this.width, 1 - offsetY / this.height)
      this.$emit('dragend')
    },
    updateSatbri (saturation, brightness) {
      let s = clamp(saturation, 0, 1)
      let v = clamp(brightness, 0, 1)
      this.updateColor({s, v})
    }
  }
}
</script>

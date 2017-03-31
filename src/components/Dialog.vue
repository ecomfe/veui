<template>
  <veui-layer class="veui-dialog"
    :layer-visible="realVisible"
    mode="NORMAL"
    :layer-class="{ 'veui-dialog-box': true, 'veui-dialog-box-mask': mask }"
    :layer-ui="ui"
    ref="layer">
    <div class="content"
      :style="contentRectStyle"
      @mousedown="bringToTop">
      <div class="head" :class="{ draggable }" v-drag>
        <span class="title" v-if="realTitle" v-text="realTitle"></span>
        <span class="title" v-else><slot name="title">弹窗标题</slot></span>
        <a class="close" v-show="realCloseVisible" @click="hide"><icon name="close"></icon></a>
      </div>
      <div class="body" :style="{ height: `${bodyHeight}px` }"><slot></slot></div>
      <div class="foot"><slot name="foot"><veui-button ui="primary" @click="$emit('ok')">确定</veui-button><veui-button @click="$emit('cancel')">取消</veui-button></slot></div>
    </div>
  </veui-layer>
</template>

<script>
import Layer from './Layer'
import 'vue-awesome/icons/close'
import Button from './Button'
import drag from '../directives/drag'

export default {
  name: 'veui-dialog',
  directives: { drag },
  components: {
    'veui-layer': Layer,
    'veui-button': Button
  },
  props: {
    ui: String,
    mask: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 200
    },
    closeVisible: {
      type: Boolean,
      default: true
    },
    center: {
      type: Boolean,
      default: true
    },
    left: {
      type: Number,
      default: null
    },
    top: {
      type: Number,
      default: null
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      realVisible: this.visible,
      realWidth: this.width,
      realCloseVisible: this.closeVisible,
      realLeft: this.left || 0,
      realTop: this.top || 0,
      realHeight: this.height,
      realTitle: this.title || null,

      isDragging: false,
      dragDistanceX: 0,
      dragDistanceY: 0,
      dragInitX: 0,
      dragInitY: 0
    }
  },
  mounted () {
    this.$on('dragstart', () => {
      this.isDragging = true
      this.dragInitX = this.realLeft
      this.dragInitY = this.realTop
    })
    this.$on('dragend', () => {
      this.isDragging = false
    })
    this.$on('drag', ({ distanceX, distanceY }) => {
      this.realLeft = this.dragInitX + distanceX
      this.realTop = this.dragInitY + distanceY
    })
  },
  watch: {
    title (value) {
      this.realTitle = value
    },
    visible (value) {
      this.realVisible = value
    },
    width (value) {
      this.realWidth = value
    },
    height (value) {
      this.realHeight = value
    },
    closeVisible (value) {
      this.realCloseVisible = value
    },
    left (value) {
      this.realLeft = value
    },
    top (value) {
      this.realTop = value
    }
  },
  computed: {
    realCenter () {
      return this.left === null && this.top === null && this.center
    },
    bodyHeight () {
      // 42 是 header 的高度
      // 36 是 button 的高度
      // 40 是 foot 垂直方向的 padding 占用的高度
      return this.height - 42 - 36 - 40
    },
    contentRectStyle () {
      return {
        width: `${this.realWidth}px`,
        height: `${this.realHeight}px`,
        left: 0,
        top: 0,
        transform: `translateX(${this.realLeft}px) translateY(${this.realTop}px)`
      }
    }
  },
  methods: {
    setCenter () {
      if (this.realCenter) {
        this.realLeft = (window.innerWidth - this.realWidth) / 2 + document.body.scrollLeft
        this.realTop = (window.innerHeight - this.realHeight) / 2 + document.body.scrollTop
      }
    },
    hide () {
      this.realVisible = false
      this.$emit('hide')
    },
    bringToTop () {
      this.$refs.layer.bringToTop()
    }
  },
  created () {
    this.setCenter()

    this.resizeListener = () => this.setCenter()
    window.addEventListener('resize', this.resizeListener)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeListener)
  }
}
</script>
<style lang="less">
  @import "../styles/theme-default/lib.less";

  .veui-dialog {
    display: none;
  }

  .veui-dialog-box {
    &.veui-dialog-box-mask {
      width: 100%;
      height: 100%;
      background: rgba(204, 204, 204, .6);
    }

    .draggable {
      user-select: none;
      cursor: all-scroll;
    }

    .content {
      background: #fff;
      position: absolute;
      box-shadow: 0px 2px 4px @veui-shadow-color-normal;
      border-radius: 4px;

      .head,
      .body,
      .foot {
        padding: 0 20px;
      }

      .head {
        height: 42px;
        line-height: 42px;
        background: @veui-theme-color-primary;
        border-radius: 4px 4px 0 0;

        .title {
          font-weight: 400;
          color: #fff;
          font-size: 16px;
        }
      }

      .body {
        padding-top: 20px;
      }

      .foot {
        padding: 20px;

        .veui-button {
          margin-right: 10px;
        }
      }

      .close {
        color: #fff;
        float: right;
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        font-size: 16px;
        margin-top: 12px;
        cursor: pointer;
      }
    }

    &[ui~="reverse"] .head {
      background: none;

      .title,
      .close {
        color: @veui-theme-color-primary;
      }
    }
  }
</style>

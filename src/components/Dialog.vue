<template>
  <veui-overlay class="veui-dialog"
    :open="$data._open"
    mode="NORMAL"
    :overlay-class="{ 'veui-dialog-box': true, 'veui-dialog-box-mask': modal }"
    :ui="ui"
    ref="overlay">
    <div class="veui-dialog-content"
      :style="contentRectStyle"
      @mousedown="focus">
      <div class="veui-dialog-content-head"
        :class="{ 'veui-dialog-draggable': draggable }"
        ref="head"
        v-drag>
        <span class="veui-dialog-content-head-title"
          v-if="$data._title"
          v-text="$data._title"></span>
        <span class="veui-dialog-content-head-title" v-else><slot name="title">弹窗标题</slot></span>
        <a class="veui-dialog-content-head-close"
          v-show="$data._closable"
          @click="hide"><icon name="close"></icon></a>
      </div>
      <div ref="body" class="veui-dialog-content-body" :style="{ height: `${bodyHeight}px` }"><slot></slot></div>
      <div ref="foot" class="veui-dialog-content-foot"><slot name="foot"><veui-button ui="primary" @click="$emit('ok')">确定</veui-button><veui-button @click="$emit('cancel')">取消</veui-button></slot></div>
    </div>
  </veui-overlay>
</template>

<script>
import { includes, upperFirst } from 'lodash'
import Overlay from './Overlay'
import 'vue-awesome/icons/close'
import Button from './Button'
import { ui } from '../mixins'

export default {
  name: 'veui-dialog',
  components: {
    'veui-overlay': Overlay,
    'veui-button': Button
  },
  mixins: [ ui ],
  props: {
    ui: String,
    modal: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: null
    },
    open: {
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
    closable: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      _open: this.open,
      _width: this.width,
      _closable: this.closable,
      _left: 0,
      _top: 0,
      _height: this.height,
      _title: this.title || null,

      isDragging: false,
      dragDistanceX: 0,
      dragDistanceY: 0,
      dragInitX: 0,
      dragInitY: 0,
      // 是否被拖拽过了。
      // 如果被拖拽过，那么在window resize的时候就不要纠正对话框的位置了
      // 在每次对话框显示的时候，这个值都会被重置为false
      isDragged: false,

      bodyHeight: 0
    }
  },
  mounted () {
    this.$on('dragstart', () => {
      if (!this.draggable) {
        return
      }

      this.isDragging = true
      this.dragInitX = this.$data._left
      this.dragInitY = this.$data._top
    })
    this.$on('dragend', () => {
      if (!this.draggable) {
        return
      }

      this.isDragging = false
    })
    this.$on('drag', ({ distanceX, distanceY }) => {
      if (!this.draggable) {
        return
      }

      this.$data._left = this.dragInitX + distanceX
      this.$data._top = this.dragInitY + distanceY

      this.isDragged = true
    })
  },
  watch: {
    title (value) {
      this.$data._title = value
    },
    open (value) {
      this.$data._open = value

      if (value) {
        this.$nextTick(() => {
          this.bodyHeight = this.getBodyHeight()
        })
        this.isDragged = false
        this[`set${upperFirst(this.position)}`]()
      }
    },
    width (value) {
      this.$data._width = value
    },
    height (value) {
      this.$data._height = value
    },
    closable (value) {
      this.$data._closable = value
    }
  },
  computed: {
    position () {
      if (includes(this.uiProps, 'top')) {
        return 'top'
      }

      if (includes(this.uiProps, 'center')) {
        return 'center'
      }

      return 'top'
    },
    contentRectStyle () {
      return {
        width: `${this.$data._width}px`,
        height: `${this.$data._height}px`,
        left: 0,
        top: 0,
        transform: `translateX(${this.$data._left}px) translateY(${this.$data._top}px)`
      }
    }
  },
  methods: {
    setPosition ({ topRatio = 0.5, leftRatio = 0.5 } = {}) {
      this.$data._left = (window.innerWidth - this.$data._width) * leftRatio + document.body.scrollLeft
      this.$data._top = (window.innerHeight - this.$data._height) * topRatio + document.body.scrollTop
    },
    setCenter () {
      this.setPosition()
    },
    setTop () {
      this.setPosition({ topRatio: 0.382 })
    },
    getBodyHeight () {
      const headHeight = this.$refs.head.getBoundingClientRect().height
      const footHeight = this.$refs.foot.getBoundingClientRect().height
      return this.height - headHeight - footHeight
    },
    hide () {
      this.$data._open = false
      this.$emit('propchange', 'open', this.$data._open)
    },
    focus () {
      this.$refs.overlay.focus()
    }
  },
  created () {
    this.resizeListener = () => {
      if (this.isDragged) {
        return
      }
      this[`set${upperFirst(this.position)}`]()
    }
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

  .veui-dialog-box[ui~="reverse"] .veui-dialog-content-head {
    background: #fff;
  }
  .veui-dialog-box[ui~="reverse"] .veui-dialog-content-head-title,
  .veui-dialog-box[ui~="reverse"] .veui-dialog-content-head-close {
    color: @veui-theme-color-primary;
  }

  .veui-dialog-box-mask {
    width: 100%;
    height: 100%;
    background: rgba(204, 204, 204, .6);
  }

  .veui-dialog-draggable {
    user-select: none;
    cursor: all-scroll;
  }

  .veui-dialog-content {
    background: #fff;
    position: absolute;
    box-shadow: 0px 2px 4px @veui-shadow-color-normal;
    border-radius: 4px;
  }

  .veui-dialog-content-head,
  .veui-dialog-content-body,
  .veui-dialog-content-foot {
    padding: 0 20px;
  }

  .veui-dialog-content-head {
    height: 42px;
    line-height: 42px;
    background: @veui-theme-color-primary;
    border-radius: 4px 4px 0 0;
  }

  .veui-dialog-content-head-title {
    font-weight: 400;
    color: #fff;
    font-size: 16px;
  }

  .veui-dialog-content-body {
    padding-top: 20px;
  }

  .veui-dialog-content-foot {
    padding: 20px;
  }

  .veui-dialog-content-foot .veui-button {
    margin-right: 10px;
  }

  .veui-dialog-content-head-close {
    color: #fff;
    float: right;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    font-size: 16px;
    margin-top: 12px;
    cursor: pointer;
  }
</style>

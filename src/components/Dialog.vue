<template>
  <veui-overlay class="veui-dialog"
    :open="localOpen"
    mode="NORMAL"
    :overlay-class="mergedOverlayClass"
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
          v-if="localTitle"
          v-text="localTitle"></span>
        <span class="veui-dialog-content-head-title" v-else><slot name="title">弹窗标题</slot></span>
        <a class="veui-dialog-content-head-close"
          v-show="localClosable"
          @click="hide"><icon name="close"></icon></a>
      </div>
      <div ref="body" class="veui-dialog-content-body"><slot></slot></div>
      <div ref="foot" class="veui-dialog-content-foot"><slot name="foot"><veui-button ui="primary" @click="$emit('ok')">确定</veui-button><veui-button @click="$emit('cancel')">取消</veui-button></slot></div>
    </div>
  </veui-overlay>
</template>

<script>
import { includes, upperFirst, isObject, isString, extend } from 'lodash'
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
    },
    overlayClass: {
      validator (value) {
        return isObject(value) || isString(value)
      },
      default: null
    }
  },
  data () {
    return {
      localOpen: this.open,
      localWidth: this.width,
      localClosable: this.closable,
      localHeight: this.height,
      localTitle: this.title || null,

      left: 0,
      top: 0,
      isDragging: false,
      dragDistanceX: 0,
      dragDistanceY: 0,
      dragInitX: 0,
      dragInitY: 0,
      // 是否被拖拽过了。
      // 如果被拖拽过，那么在window resize的时候就不要纠正对话框的位置了
      // 在每次对话框显示的时候，这个值都会被重置为false
      isDragged: false
    }
  },
  mounted () {
    this.$on('dragstart', () => {
      if (!this.draggable) {
        return
      }

      this.isDragging = true
      this.dragInitX = this.left
      this.dragInitY = this.top
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

      this.left = this.dragInitX + distanceX
      this.top = this.dragInitY + distanceY

      this.isDragged = true
    })

    // 一进来就要求把对话框展示出来，此时对话框肯定没被拖拽过，所以要设置一下对话框位置
    if (this.open) {
      this[`set${upperFirst(this.position)}`]()
    }
  },
  watch: {
    title (value) {
      this.localTitle = value
    },
    open (value) {
      this.localOpen = value

      if (value) {
        this.isDragged = false
      }
    },
    width (value) {
      this.localWidth = value
    },
    height (value) {
      this.localHeight = value
    },
    closable (value) {
      this.localClosable = value
    }
  },
  computed: {
    mergedOverlayClass () {
      const klass = {}
      if (isString(this.overlayClass)) {
        this.overlayClass.split(/\s+/).forEach(cls => {
          klass[cls] = true
        })
      } else {
        extend(klass, this.overlayClass)
      }

      klass['veui-dialog-box'] = true
      klass['veui-dialog-box-mask'] = this.modal

      return klass
    },
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
        width: `${this.localWidth}px`,
        height: `${this.localHeight}px`,
        left: 0,
        top: 0,
        transform: `translate(${this.left}px,${this.top}px)`
      }
    }
  },
  beforeUpdate () {
    if (this.open && !this.isDragged) {
      // 只有在对话框显示出来了，并且没被拖拽过，才去纠正位置
      this[`set${upperFirst(this.position)}`]()
    }
  },
  updated () {
    if (this.open) {
      this.$refs.body.style.height = `${this.getBodyHeight()}px`
    }
  },
  methods: {
    setPosition ({ topRatio = 0.5, leftRatio = 0.5 } = {}) {
      this.left = (window.innerWidth - this.localWidth) * leftRatio + document.body.scrollLeft
      this.top = (window.innerHeight - this.localHeight) * topRatio + document.body.scrollTop
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
      this.localOpen = false
      this.$emit('update:open', this.localOpen)
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

  &-box {
    position: relative;

    &[ui~="reverse"] {
      .veui-dialog-content {
        border: 1px solid @veui-gray-color-sup-3;

        &-head {
          background: #fff;
        }

        &-head-title,
        &-head-close {
          color: @veui-theme-color-primary;
        }
      }
    }
  }

  &-box-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(204, 204, 204, .6);
  }

  &-draggable {
    user-select: none;
    cursor: all-scroll;
  }

  &-content {
    position: absolute;
    background: #fff;
    border-radius: 4px;
    .veui-shadow(extend);

    &-head,
    &-body,
    &-foot {
      padding: 0 20px;
    }

    &-head {
      height: 42px;
      line-height: 42px;
      background: @veui-theme-color-primary;
      border-radius: 4px 4px 0 0;
    }

    &-head-title {
      font-weight: 400;
      color: #fff;
      font-size: 16px;
    }

    &-body {
      padding-top: 20px;
      box-sizing: border-box;
    }

    &-foot {
      padding: 20px;
    }

    &-foot .veui-button {
      margin-right: 10px;
    }

    &-head-close,
    &-head-close:hover {
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
  }
}

</style>

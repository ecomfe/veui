<template>
  <veui-overlay class="veui-dialog"
    :open="localOpen"
    :overlay-class="mergedOverlayClass"
    :ui="ui"
    ref="overlay">
    <div class="veui-dialog-content"
      :style="contentRectStyle"
      @mousedown="focus"
      ref="content">
      <div class="veui-dialog-content-head"
        :class="{ 'veui-dialog-draggable': draggable }"
        ref="head"
        v-drag>
        <span class="veui-dialog-content-head-title"
          v-if="localTitle"
          v-text="localTitle">
        </span>
        <span class="veui-dialog-content-head-title"
          v-else>
          <slot name="title">弹窗标题</slot>
        </span>
        <a class="veui-dialog-content-head-close"
          v-show="localClosable"
          @click="hide">
          <icon name="close"></icon>
        </a>
      </div>
      <div ref="body" class="veui-dialog-content-body"><slot></slot></div>
      <div ref="foot" class="veui-dialog-content-foot">
        <slot name="foot">
          <veui-button ui="primary" @click="$emit('ok')">确定</veui-button>
          <veui-button @click="$emit('cancel')">取消</veui-button>
        </slot>
      </div>
    </div>
  </veui-overlay>
</template>

<script>
import { includes, upperFirst, isObject, isString, extend } from 'lodash'
import Overlay from './Overlay'
import Button from './Button'
import { ui } from '../mixins'
import { drag } from '../directives'
import 'vue-awesome/icons/close'

export default {
  name: 'veui-dialog',
  components: {
    'veui-overlay': Overlay,
    'veui-button': Button
  },
  directives: { drag },
  mixins: [ui],
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
      default: null
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

      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth

      // 不要让对话框拖到可视区外部去了
      this.left = this.dragInitX + distanceX
      if (this.left < 0) {
        this.left = 0
      } else if (this.left + this.$refs.content.offsetWidth > windowWidth) {
        this.left = windowWidth - this.$refs.content.offsetWidth
      }

      this.top = this.dragInitY + distanceY
      if (this.top < 0) {
        this.top = 0
      } else if (
        this.$refs.content.offsetHeight < windowHeight &&
        this.top + this.$refs.content.offsetHeight > windowHeight
      ) {
        this.top = windowHeight - this.$refs.content.offsetHeight
      }

      this.isDragged = true
    })

    // 一进来就要求把对话框展示出来，此时对话框肯定没被拖拽过，所以要设置一下对话框位置
    if (this.localOpen) {
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
    if (this.localOpen && !this.isDragged) {
      // 只有在对话框显示出来了，并且没被拖拽过，才去纠正位置
      this[`set${upperFirst(this.position)}`]()
    }
  },
  updated () {
    // 如果设置了总体高度，就要计算出body部分的高度。
    // 为什么在这里计算，而不是在mounted里面计算一次就万事大吉了呢？
    // 因为在mounted的时候，Dialog很可能还没显示出来，甚至有可能都没有挂载到Document上面去。
    if (this.localOpen && this.localHeight !== null) {
      this.$refs.body.style.height = `${this.getBodyHeight()}px`
    }
  },
  methods: {
    setPosition ({ topRatio = 0.5, leftRatio = 0.5 } = {}) {
      let height = this.localHeight

      const setTop = () => {
        // 如果对话框超过可视区域高度的话，就直接把对话框的top设为0
        if (height <= window.innerHeight) {
          this.top = (window.innerHeight - height) * topRatio
        } else {
          this.top = 0
        }
      }

      if (height === null) {
        this.$nextTick(() => {
          height = this.$refs.content.offsetHeight
          setTop()
        })
      } else {
        setTop()
      }

      this.left = (window.innerWidth - this.localWidth) * leftRatio
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

        &-head-title {
          color: @veui-gray-color-strong;
        }

        &-head-close {
          color: @veui-gray-color-normal;
        }
      }
    }
  }

  &-box-mask {
    .fixed(0);
    background: rgba(0, 0, 0, .5);
    overflow: auto;
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
      height: 40px;
      line-height: 40px;
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
      padding: 15px 20px;
      text-align: center;
    }

    &-foot .veui-button {
      min-width: 94px;

      &:first-child {
        margin-right: 20px;
      }
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

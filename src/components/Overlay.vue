<template>
  <div class="veui-overlay">
    <slot name="target"></slot>
    <div class="veui-overlay-box"
      :class="overlayClass"
      :ui="ui"
      ref="box"
      :style="{zIndex}"
      v-show="open"><slot></slot></div>
  </div>
</template>
<script>
  import Tether from 'tether'
  import { omit, isObject, isString } from 'lodash'

  const ZINDEX_INSTANCE_KEY = `__veui_overlay_zindex_instance`

  export default {
    name: 'overlay',
    uiTypes: ['overlay'],
    props: {
      open: {
        type: Boolean,
        default: false
      },
      ui: String,
      options: {
        type: Object,
        default () {
          return {}
        }
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
        zIndex: 0
      }
    },
    watch: {
      open (value) {
        // 在显示的时候重新定位一下，因为在隐藏状态下计算不了位置
        if (value && this.isAttach()) {
          this.$nextTick(() => this.tether.position())
        }
      }
    },
    mounted () {
      if (this.isAttach()) {
        this.tether = new Tether({
          element: this.$refs.box,
          target: this.$slots.target[0].elm,
          ...omit(this.options, 'element', 'target')
        })
      } else {
        let box = this.$refs.box
        document.body.appendChild(box)
      }

      this[ZINDEX_INSTANCE_KEY] = this.$veui.addOverlay(this.isAttach() ? this.findParentOverlayId() : null)
      this[ZINDEX_INSTANCE_KEY].$on(
        'zindexchange',
        zIndex => {
          this.zIndex = zIndex
        }
      )
      this[ZINDEX_INSTANCE_KEY].refresh()
    },
    methods: {

      isOverlay (componentInstance) {
        return componentInstance.uiTypes && componentInstance.uiTypes[0] === 'overlay'
      },

      /**
       * 向上找到父级overlay组件的Id
       */
      findParentOverlayId () {
        let cur = this.$slots.target[0]
        while (cur) {
          if (cur.componentInstance && this.isOverlay(cur.componentInstance)) {
            return cur.componentInstance[ZINDEX_INSTANCE_KEY].id
          }
          cur = cur.parent
        }
      },

      focus () {
        this[ZINDEX_INSTANCE_KEY].toTop()
      },

      isAttach () {
        return this.$slots.target && this.$slots.target.length
      }
    },
    beforeDestroy () {
      if (this.isAttach()) {
        this.tether.destroy()
        document.body.removeChild(this.tether.element)
      } else {
        document.body.removeChild(this.$refs.box)
      }

      this[ZINDEX_INSTANCE_KEY].$off()
      this[ZINDEX_INSTANCE_KEY].remove()
      this[ZINDEX_INSTANCE_KEY] = null
    }
  }
</script>
<style lang="less">
.veui-overlay {
  display: inline-block;
}

.veui-overlay-box {
  position: absolute;
}
</style>

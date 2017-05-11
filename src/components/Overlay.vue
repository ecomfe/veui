<template>
  <div class="veui-overlay">
    <div class="veui-overlay-box"
      :class="overlayClass"
      :ui="ui"
      ref="box"
      :style="{zIndex}"
      v-show="localOpen">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Tether from 'tether'
import { omit, isObject, isString } from 'lodash'
import { getNodes } from '../utils/context'

const ZINDEX_INSTANCE_KEY = '__veui_overlay_zindex_instance__'

export default {
  name: 'veui-overlay',
  uiTypes: ['overlay'],
  props: {
    ui: String,
    overlayClass: {
      validator (value) {
        return isObject(value) || isString(value)
      },
      default: null
    },
    open: {
      type: Boolean,
      default: false
    },
    target: {
      default: null
    },
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      zIndex: 0,
      appendBody: false,
      localOpen: false,
      targetNode: null
    }
  },
  computed: {
    isAttach () {
      return !!this.target
    }
  },
  watch: {
    open (value) {
      this.updateOverlayData()
    },
    target () {
      this.updateOverlayData()
    }
  },
  mounted () {
    const box = this.$refs.box
    document.body.appendChild(box)

    this.updateOverlayData()
  },
  updated () {
    if (this.isOpenDirty) {
      this.isOpenDirty = false
      this.updateOverlayDOM()
    }
  },
  methods: {

    createZIndexInstance () {
      this[ZINDEX_INSTANCE_KEY] = this.$veui.addOverlay(this.isAttach ? this.findParentOverlayId() : null)
      this[ZINDEX_INSTANCE_KEY].$on(
        'zindexchange',
        zIndex => {
          this.zIndex = zIndex
        }
      )
      this[ZINDEX_INSTANCE_KEY].refresh()
    },

    updateOverlayDOM () {
      if (this.isAttach) {
        if (this.open && this.targetNode) {
          this.closeOverlay()
          this.tether = new Tether({
            element: this.$refs.box,
            target: this.targetNode,
            ...omit(this.options, 'element', 'target')
          })
          this.$nextTick(() => this.tether.position())
          this.createZIndexInstance()
        } else {
          this.closeOverlay()
        }
      } else {
        if (this.open) {
          this.closeOverlay()
          this.createZIndexInstance()
        } else {
          this.closeOverlay()
        }
      }
    },

    getTargetNode (target) {
      return getNodes(target, this.$vnode.context)[0]
    },

    updateOverlayData () {
      this.isOpenDirty = true
      this.localOpen = false
      if (this.isAttach) {
        if (this.open) {
          this.targetNode = this.getTargetNode(this.target)
          this.localOpen = !!this.targetNode
        } else {
          this.localOpen = false
        }
      } else {
        this.localOpen = this.open
      }

      // 发生了变化才抛事件出去
      if (this.localOpen !== this.open) {
        this.$emit('update:open', this.localOpen)
      }
    },

    closeOverlay () {
      if (this.isAttach) {
        this.tether && this.tether.destroy()
        this.tether = null
      }

      if (this[ZINDEX_INSTANCE_KEY]) {
        this[ZINDEX_INSTANCE_KEY].$off()
        this[ZINDEX_INSTANCE_KEY].remove()
        this[ZINDEX_INSTANCE_KEY] = null
      }
    },

    isOverlay (componentInstance) {
      return componentInstance.uiTypes && componentInstance.uiTypes[0] === 'overlay'
    },

    /**
     * 向上找到父级overlay组件的Id。
     * 前提条件：Overlay和target元素必须在同一个父Overlay之内
     */
    findParentOverlayId () {
      let cur = this.$vnode.context
      while (cur) {
        if (cur && this.isOverlay(cur)) {
          return cur[ZINDEX_INSTANCE_KEY].id
        }
        cur = cur.$parent
      }
    },

    focus () {
      this[ZINDEX_INSTANCE_KEY].toTop()
    }
  },
  beforeDestroy () {
    this.closeOverlay()
    this.$refs.box.parentNode.removeChild(this.$refs.box)
  }
}
</script>
<style lang="less">
.veui-overlay {
  display: none;
}
</style>

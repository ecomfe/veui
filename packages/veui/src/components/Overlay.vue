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
import { assign, isObject, isString } from 'lodash'
import { getNodes } from '../utils/context'
import overlayManager from '../managers/overlay'
import config from '../managers/config'

config.defaults({
  'overlay.baseZIndex': 200
})

overlayManager.setBaseZIndex(config.get('overlay.baseZIndex'))

const OVERLAY_INSTANCE_KEY = '__veui_overlay_instance_key__'

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
    },
    priority: Number
  },
  data () {
    return {
      zIndex: 0,
      appendBody: false,
      localOpen: this.open,
      targetNode: null,

      // 把 id 放 data 上面方便 debug
      overlayNodeId: null
    }
  },
  watch: {
    open (value) {
      this.localOpen = value
      this.updateOverlayDOM()
      if (value) {
        this[OVERLAY_INSTANCE_KEY].toTop()
      }
      this.$emit('update:open', value)
    },
    target () {
      this.findTargetNode()
    },
    targetNode () {
      this.updateOverlayDOM()
    }
  },
  mounted () {
    const box = this.$refs.box
    document.body.appendChild(box)

    this.findTargetNode()
    this.updateOverlayDOM()
  },
  methods: {

    // 更新 zindex 树
    updateNode () {
      if (!this[OVERLAY_INSTANCE_KEY]) {
        this[OVERLAY_INSTANCE_KEY] = overlayManager.createNode({
          parentId: this.findParentOverlayId(),
          priority: this.priority
        })
        this[OVERLAY_INSTANCE_KEY].$on('zindexchange', (zIndex) => {
          this.zIndex = zIndex
        })
        this.overlayNodeId = this[OVERLAY_INSTANCE_KEY].id
      } else {
        this[OVERLAY_INSTANCE_KEY].appendTo(this.findParentOverlayId(), this.priority)
      }
    },

    findParentOverlayId () {
      let cur = this.$vnode.context
      while (cur) {
        if (cur && this.isOverlay(cur)) {
          return cur[OVERLAY_INSTANCE_KEY].id
        }
        cur = cur.$parent
      }
    },

    updateOverlayDOM () {
      if (!this.localOpen) {
        return
      }

      if (this.targetNode) {
        const options = assign({}, this.options, {
          element: this.$refs.box,
          target: this.targetNode
        })

        if (!this.tether) {
          this.tether = new Tether(options)
        } else {
          this.tether.setOptions(options)
        }

        // 修改 tether 的 options 的时候，有可能 tether 的容器元素还没显示出来，
        // 所以保险起见，统一 nextTick 触发一下 tether 的重新计算
        this.$nextTick(() => this.tether.position())
      }

      this.updateNode()
    },

    findTargetNode () {
      if (this.target) {
        this.targetNode = getNodes(this.target, this.$vnode.context)[0]
      } else {
        this.targetNode = null
      }
    },

    isOverlay (componentInstance) {
      return componentInstance.uiTypes && componentInstance.uiTypes[0] === 'overlay'
    },

    focus () {
      this[OVERLAY_INSTANCE_KEY].toTop()
    }
  },
  beforeDestroy () {
    this.tether && this.tether.destroy()
    this.tether = null

    if (this[OVERLAY_INSTANCE_KEY]) {
      this[OVERLAY_INSTANCE_KEY].$off()
      this[OVERLAY_INSTANCE_KEY].remove()
      this[OVERLAY_INSTANCE_KEY] = null
    }

    this.$refs.box.parentNode.removeChild(this.$refs.box)
  }
}
</script>

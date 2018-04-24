<template>
<div class="veui-overlay">
  <div class="veui-overlay-box"
    :class="overlayClass"
    :ui="ui"
    ref="box"
    :style="{zIndex}"
    v-show="realOpen">
    <slot/>
  </div>
</div>
</template>

<script>
import Tether from 'tether'
import { assign } from 'lodash'
import { getNodes } from '../utils/context'
import overlayManager from '../managers/overlay'
import focusManager from '../managers/focus'
import config from '../managers/config'
import ui from '../mixins/ui'
import { getClassPropDef, isType } from '../utils/helper'
import '../common/uiTypes'

config.defaults({
  'overlay.baseZIndex': 200
})

overlayManager.setBaseZIndex(config.get('overlay.baseZIndex'))

export default {
  name: 'veui-overlay',
  uiTypes: ['overlay'],
  mixins: [ui],
  props: {
    overlayClass: getClassPropDef(),
    open: Boolean,
    target: {
      default: null
    },
    options: {
      type: Object,
      default () {
        return {}
      }
    },
    priority: Number,
    autofocus: Boolean,
    modal: Boolean
  },
  data () {
    return {
      zIndex: null,
      appendBody: false,
      targetNode: null,
      source: null
    }
  },
  watch: {
    open (value) {
      this.updateOverlayDOM()
      this.updateNode()
      if (value) {
        let node = this.overlayNode
        node.toTop()

        this.initFocus()
      } else {
        this.destroyFocus()
      }
    },
    target () {
      this.findTargetNode()
    },
    targetNode () {
      this.updateOverlayDOM()
      this.updateNode()
    }
  },
  created () {
    // 初始化时，updateNode 依赖 created 在组件树中的执行顺序：
    // 先父后子
    // 而 mounted 执行顺序是先子后父，所以 updateNode 只能放在
    // created 里面。
    this.updateNode()
  },
  mounted () {
    const box = this.$refs.box
    document.body.appendChild(box)

    if (this.open) {
      this.initFocus()
    }

    this.findTargetNode()
    this.updateOverlayDOM()
  },
  computed: {
    realOpen () {
      return this.zIndex !== null && this.open
    }
  },
  methods: {
    // 更新 zindex 树
    updateNode () {
      if (!this.overlayNode) {
        this.overlayNode = overlayManager.createNode({
          parentId: this.findParentOverlayId(),
          priority: this.priority
        })
        this.overlayNode.$on('zindexchange', zIndex => {
          this.zIndex = zIndex
        })
      } else {
        this.overlayNode.appendTo(this.findParentOverlayId(), this.priority)
      }
    },

    findParentOverlayId () {
      let cur = this.$vnode.context
      while (cur) {
        if (cur && this.isOverlay(cur)) {
          return cur.overlayNode.id
        }
        cur = cur.$parent
      }
    },

    updateOverlayDOM () {
      if (!this.open) {
        return
      }

      if (this.targetNode) {
        let options = assign({}, this.options, {
          element: this.$refs.box,
          target: this.targetNode
        })

        if (!this.tether) {
          this.tether = new Tether(options)
          this.tether.on('repositioned', () => { this.$emit('locate') })
        } else {
          this.tether.setOptions(options)
        }

        // 修改 tether 的 options 的时候，有可能 tether 的容器元素还没显示出来，
        // 所以保险起见，统一 nextTick 触发一下 tether 的重新计算
        this.$nextTick(() => {
          this.tether.position()
        })
      }
    },

    relocate () {
      if (this.tether) {
        this.tether.position()
      }
    },

    findTargetNode () {
      if (this.target) {
        this.targetNode = getNodes(this.target, this.$vnode.context)[0]
      } else {
        this.targetNode = null
      }
    },

    isOverlay (componentInstance) {
      return isType(componentInstance, 'overlay')
    },

    focus () {
      this.overlayNode.toTop()
    },

    initFocus () {
      if (!this.autofocus) {
        return
      }

      if (!this.focusContext) {
        this.focusContext = focusManager.createContext(this.$refs.box, {
          source: document.activeElement,
          trap: this.modal
        })
      } else {
        focusManager.toTop(this.focusContext)
      }
    },

    destroyFocus () {
      if (this.focusContext) {
        focusManager.remove(this.focusContext)
        this.focusContext = null
      }
    }
  },
  beforeDestroy () {
    this.tether && this.tether.destroy()
    this.tether = null

    let node = this.overlayNode
    node.$off()
    node.remove()
    this.overlayNode = null

    this.destroyFocus()

    this.$refs.box.parentNode.removeChild(this.$refs.box)
  }
}
</script>

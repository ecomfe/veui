<template>
<div
  class="veui-overlay"
  aria-hidden="true"
>
  <transition
    name="veui-overlay"
    @after-leave="$emit('afterclose')"
  >
    <div
      v-show="realOpen"
      ref="box"
      class="veui-overlay-box"
      :class="realOverlayClass"
      :ui="realUi"
      :style="{zIndex}"
    >
      <slot/>
    </div>
  </transition>
</div>
</template>

<script>
import Tether from 'tether'
import { getNodes } from '../utils/context'
import overlayManager from '../managers/overlay'
import focusManager from '../managers/focus'
import config from '../managers/config'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import {
  getClassPropDef,
  mergeClasses,
  isType,
  resolveOverlayPosition
} from '../utils/helper'
import '../common/uiTypes'

config.defaults({
  'overlay.baseZIndex': 200,
  'overlay.overlayClass': {}
})

overlayManager.setBaseOrder(config.get('overlay.baseZIndex'))

export default {
  name: 'veui-overlay',
  uiTypes: ['overlay'],
  mixins: [ui, focusable],
  props: {
    position: String,
    overlayClass: getClassPropDef(),
    open: Boolean,
    target: {
      type: process.env.VUE_ENV === 'server' ? true : [String, Object, Element],
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
  computed: {
    realOpen () {
      return this.zIndex !== null && this.open
    },
    realOverlayClass () {
      return mergeClasses(this.overlayClass, config.get('overlay.overlayClass'))
    }
  },
  watch: {
    realOpen (val) {
      this.toggleLocator(val)
      this.updateLocator()
      this.updateNode()
      if (val) {
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
      this.updateLocator()
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
    this.overlayBox = this.$refs.box
    document.body.appendChild(this.overlayBox)

    if (this.realOpen) {
      this.initFocus()
    }

    this.findTargetNode()
    this.updateLocator()
  },
  updated () {
    this.$nextTick(() => {
      if (this.realOpen) {
        this.relocate()
      }
    })
  },
  destroyed () {
    this.destroyLocator()

    let node = this.overlayNode
    node.remove()
    this.overlayNode = null

    this.destroyFocus()

    this.$el.appendChild(this.overlayBox)
    this.overlayBox = null
  },
  methods: {
    // 更新 zindex 树
    updateNode () {
      if (!this.overlayNode) {
        this.overlayNode = overlayManager.createNode({
          parentId: this.findParentOverlayId(),
          priority: this.priority,
          orderChangeCallback: order => {
            this.zIndex = order
          }
        })
      } else {
        this.overlayNode.appendTo(this.findParentOverlayId(), this.priority)
      }
    },

    findParentOverlayId () {
      let cur = this.$parent
      while (cur) {
        if (cur && this.isOverlay(cur)) {
          return cur.overlayNode.id
        }
        cur = cur.$parent
      }
    },

    updateLocator () {
      if (!this.realOpen) {
        return
      }

      if (this.targetNode) {
        let options = {
          ...resolveOverlayPosition(this.position),
          ...this.options,
          element: this.overlayBox,
          target: this.targetNode
        }

        if (!this.tether) {
          this.tether = new Tether(options)
          this.tether.on('repositioned', () => {
            this.$emit('locate')
          })
        } else {
          this.tether.setOptions(options)
        }
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
      if (this.overlayNode) {
        this.overlayNode.toTop()
      }
      if (this.focusContext) {
        this.focusContext.toTop()
      }
    },

    initFocus () {
      if (!this.autofocus) {
        return
      }

      if (!this.focusContext && this.overlayBox) {
        this.focusContext = focusManager.createContext(this.overlayBox, {
          source: document.activeElement,
          trap: this.modal
        })

        this.lastSource = document.activeElement
      }
    },

    destroyFocus () {
      if (this.focusContext) {
        focusManager.remove(this.focusContext)
        this.focusContext = null
      }
    },

    toggleLocator (enable) {
      if (!this.tether) {
        return
      }
      this.tether[enable ? 'enable' : 'disable']()
    },

    destroyLocator () {
      if (!this.tether) {
        return
      }
      this.tether.destroy()
      this.tether = null
    }
  }
}
</script>

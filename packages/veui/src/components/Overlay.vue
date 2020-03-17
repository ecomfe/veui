<script>
import Popper from 'popper.js'
import { getNodes } from '../utils/context'
import overlayManager from '../managers/overlay'
import focusManager from '../managers/focus'
import config from '../managers/config'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import {
  getClassPropDef,
  mergeClasses,
  isType,
  ignoreElements
} from '../utils/helper'
import '../common/uiTypes'
import { omit } from 'lodash'

const VEUI_OVERLAY_ELEMENT_NAME = 'veui-x-overlay'

ignoreElements(VEUI_OVERLAY_ELEMENT_NAME)

config.defaults({
  'overlay.baseZIndex': 200,
  'overlay.overlayClass': {}
})

overlayManager.setBaseOrder(config.get('overlay.baseZIndex'))

export default {
  name: 'veui-overlay',
  uiTypes: ['overlay', 'transparent'],
  mixins: [prefix, ui, focusable],
  props: {
    position: String,
    overlayClass: getClassPropDef(),
    open: Boolean,
    inline: Boolean,
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
    modal: Boolean,
    matchWidth: Boolean
  },
  data () {
    return {
      zIndex: null,
      minWidth: null,
      targetNode: null,
      source: null
    }
  },
  computed: {
    realOpen () {
      return (this.inline || this.zIndex !== null) && this.open
    },
    realOverlayClass () {
      return mergeClasses(this.overlayClass, config.get('overlay.overlayClass'))
    },
    realPosition () {
      return this.position || this.options.position || 'auto'
    }
  },
  watch: {
    realOpen (val) {
      if (this.inline) {
        return
      }

      this.updateWidth()
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
    matchWidth () {
      this.updateWidth()
    },
    target () {
      if (this.inline) {
        return
      }
      this.findTargetNode()
    },
    targetNode () {
      if (this.inline) {
        return
      }
      this.updateLocator()
      this.updateNode()
    }
  },
  created () {
    if (this.inline) {
      return
    }
    // 初始化时，updateNode 依赖 created 在组件树中的执行顺序：
    // 先父后子
    // 而 mounted 执行顺序是先子后父，所以 updateNode 只能放在
    // created 里面。
    this.updateNode()
  },
  mounted () {
    this.updateOnInlineChange()
  },
  updated () {
    this.updateOnInlineChange()
    if (!this.inline) {
      this.$nextTick(() => {
        if (this.realOpen) {
          this.relocate()
        }
      })
    }
  },
  destroyed () {
    if (this.ported) {
      this.removePortal(true)
    }
  },
  methods: {
    // 更新 zindex 树
    updateNode () {
      if (!this.overlayNode) {
        let overlay = config.get('managers.overlay') || overlayManager
        this.overlayNode = overlay.createNode({
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

    updateOnInlineChange () {
      if (this.inline && this.ported) {
        // non-inline -> inline
        this.removePortal()
        this.ported = false
      } else if (!this.inline && !this.ported) {
        // inline -> non-inline
        this.overlayBox = this.$refs.box

        // create a connection to the portal entrance
        // v-outside will honor this connection, so we'd
        // better document this somewhere properly (TODO)
        this.overlayBox.__portal__ = this.$el
        document.body.appendChild(this.overlayBox)
        this.findTargetNode()

        if (this.realOpen) {
          this.initFocus()
          this.updateWidth()
        }

        this.updateLocator()
        this.ported = true
      }
    },

    removePortal (destroy) {
      this.destroyLocator()

      let node = this.overlayNode
      node && node.remove()
      this.overlayNode = null

      this.destroyFocus()
      if (destroy) {
        // destroy 时将原来移出去的移回来
        this.$el.appendChild(this.overlayBox)
      } else {
        // 切换到 inline, 将原来移出去的节点删了（会重新渲染一个）
        this.overlayBox.parentNode.removeChild(this.overlayBox)
      }
      delete this.overlayBox.__portal__
      this.overlayBox = null
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

    updateWidth () {
      if (!this.matchWidth) {
        this.minWidth = null
        return
      }

      let { box } = this.$refs
      let { targetNode } = this
      if (!box || !targetNode) {
        return
      }

      this.minWidth = `${targetNode.offsetWidth}px`
    },

    updateLocator () {
      if (!this.realOpen) {
        return
      }

      if (this.targetNode) {
        if (this.popper) {
          this.popper.destroy()
        }

        this.popper = new Popper(this.targetNode, this.overlayBox, {
          placement: this.realPosition,
          modifiers: {
            preventOverflow: {
              boundariesElement: 'viewport',
              enabled: false
            },
            hide: {
              enabled: false
            },
            flip: {
              flipVariationsByContent: true
            },
            ...omit(this.options, 'position')
          },
          onUpdate: () => {
            this.$emit('locate')
          }
        })
      }
    },

    relocate () {
      if (this.popper) {
        this.popper.scheduleUpdate()
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
      if (this.inline || !this.popper) {
        return
      }
      this.popper[enable ? 'enableEventListeners' : 'disableEventListeners']()
    },

    destroyLocator () {
      if (this.inline || !this.popper) {
        return
      }
      this.popper.destroy()
      this.popper = null
    }
  },
  render () {
    const box = (
      <VEUI_OVERLAY_ELEMENT_NAME
        v-show={this.realOpen}
        style={{
          zIndex: this.zIndex,
          minWidth: this.minWidth
        }}
        class={{
          [this.$c('overlay-box')]: true,
          ...this.realOverlayClass
        }}
        ref="box"
        ui={this.realUi}
      >
        {this.$slots.default}
      </VEUI_OVERLAY_ELEMENT_NAME>
    )

    return this.inline ? (
      box
    ) : (
      <div class={this.$c('overlay')} aria-hidden="true">
        <transition
          name={this.$c('overlay')}
          onAfterLeave={() => {
            this.$emit('afterclose')
          }}
          onAfterEnter={() => {
            this.$emit('afteropen')
          }}
        >
          {box}
        </transition>
      </div>
    )
  }
}
</script>

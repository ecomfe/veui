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
  ignoreElements,
  createPortal,
  inheritScopeAttrs
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
    matchWidth: Boolean,
    local: Boolean
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
      return (
        this.inline || (this.open && (this.local ? true : this.zIndex !== null))
      )
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
        if (node) {
          node.toTop()
        }
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
    },
    inline (val) {
      if (val) {
        this.disposePortal()
      } else {
        this.$nextTick(this.initPortal)
      }
    },
    local (val) {
      this.disposePortal()
      this.initPortal()
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
    if (!this.inline) {
      this.initPortal()
    }
  },
  updated () {
    if (!this.inline) {
      this.$nextTick(() => {
        if (this.realOpen) {
          this.relocate()
        }
      })
    }
  },
  destroyed () {
    if (!this.inline) {
      this.disposePortal()
    }
  },
  methods: {
    // 更新 zindex 树
    updateNode () {
      if (this.local) {
        return
      }
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

    initPortal () {
      this.overlayBox = this.$refs.box

      if (this.local) {
        inheritScopeAttrs(this.overlayBox, this.$el)
      } else {
        this.removePortal = createPortal(this.overlayBox, document.body)
      }

      this.findTargetNode()

      if (this.realOpen) {
        this.initFocus()
        this.updateWidth()
      }

      this.updateLocator()
    },

    disposePortal () {
      this.destroyLocator()

      if (this.overlayNode) {
        this.overlayNode.remove()
        this.overlayNode = null
      }

      this.destroyFocus()

      if (this.removePortal) {
        this.removePortal()
        this.removePortal = null
      }

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
      <div class={this.$c('overlay')} aria-hidden="true" v-show={this.local}>
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

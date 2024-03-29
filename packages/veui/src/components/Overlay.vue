<script>
import Popper from 'popper.js'
import { getNodes } from '../utils/context'
import overlayManager from '../managers/overlay'
import focusManager from '../managers/focus'
import useConfig from '../mixins/config'
import config from '../managers/config'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import {
  LOOSE_PROP_DEF,
  isType,
  ignoreElements,
  createPortal,
  inheritScopeAttrs,
  normalizeClass,
  normalizeStyle
} from '../utils/helper'
import '../common/global'
import { omit } from 'lodash'

const VEUI_OVERLAY_ELEMENT_NAME = 'veui-x-overlay'

const EMITS = ['locate', 'orderchange', 'afteropen', 'afterclose']

ignoreElements(VEUI_OVERLAY_ELEMENT_NAME)

config.defaults(
  {
    baseZIndex: 200,
    overlayClass: {}
  },
  'overlay'
)

overlayManager.setBaseOrder(config.get('overlay.baseZIndex'))

export default {
  name: 'veui-overlay',
  uiTypes: ['overlay', 'transparent'],
  mixins: [
    prefix,
    ui,
    focusable,
    useConfig('config', ['overlay', 'managers.overlay'])
  ],
  props: {
    position: String,
    overlayClass: LOOSE_PROP_DEF,
    overlayStyle: LOOSE_PROP_DEF,
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
      targetEl: null,
      source: null,
      leaving: false
    }
  },
  computed: {
    realOpen () {
      return this.open && (this.inline || this.local || this.zIndex !== null)
    },
    realOverlayClass () {
      return normalizeClass(
        this.overlayClass,
        this.config['overlay.overlayClass']
      )
    },
    realOverlayStyle () {
      return normalizeStyle(this.overlayStyle, {
        zIndex: this.zIndex,
        minWidth: this.minWidth
      })
    },
    realPosition () {
      return this.position || this.options.position || 'auto'
    },
    realLeaving () {
      return !this.inline && this.leaving
    }
  },
  watch: {
    realOpen (val) {
      this.leaving = !val

      if (val) {
        this.handleAfterOpen()
      }

      if (this.inline) {
        return
      }

      this.toggleLocator(val)
      this.updateLocator()
      this.updateWidth()
      this.updateOverlayNode(val)
      if (val) {
        let node = this.overlayNode
        if (node) {
          node.toTop()
        }
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
      this.updateTargetElement()
    },
    targetEl () {
      if (this.inline) {
        return
      }
      this.updateLocator()
      this.updateOverlayNode()
    },
    inline (val) {
      if (val) {
        this.disposePortal()
      } else {
        this.$nextTick(this.initPortal)
      }
    },
    local () {
      this.disposePortal()
      this.initPortal()
    }
  },
  created () {
    if (!this.inline) {
      // 初始化时，updateOverlayNode 依赖 created 在组件树中的执行顺序：
      // 先父后子
      // 而 mounted 执行顺序是先子后父，所以 updateOverlayNode 只能放在
      // created 里面。
      this.updateOverlayNode()
    }
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
    updateOverlayNode (val) {
      if (this.local) {
        return
      }
      if (!this.overlayNode) {
        let overlay = this.config['managers.overlay'] || overlayManager
        this.overlayNode = overlay.createNode({
          parentId: this.findParentOverlayId(),
          priority: this.priority,
          orderChangeCallback: (order) => {
            // 第一次会在 createNode 函数调用中触发，即 createNode 还没返回（肯定无 this.overlayNode），就会设置zIndex
            // 可能会导致 realOpen 变化，在测试环境中很多渲染都没有改成 sync: false, 会导致 realOpen watcher 同步触发
            // 又会进入 updateOverlayNode ，因为都是同步的（createNode 还没返回），会再次创建 createNode
            // 所以单测还是统一用 sync: false
            this.zIndex = order
            this.$emit('orderchange', order)
          }
        })
      } else if (val) {
        this.overlayNode.appendTo(this.findParentOverlayId(), this.priority)
      }
    },
    initPortal () {
      let { box } = this.$refs

      if (this.local) {
        inheritScopeAttrs(box, this.$el)
      } else {
        this.removePortal = createPortal(box, box.ownerDocument.body)
      }

      if (this.realOpen) {
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
    },
    findParentOverlayId () {
      let cur = this.$parent
      while (cur) {
        if (isType(cur, 'overlay') && cur.overlayNode) {
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
      let { targetEl } = this
      if (!box || !targetEl) {
        return
      }

      this.minWidth = `${targetEl.offsetWidth}px`
    },
    updateLocator () {
      if (!this.realOpen) {
        return
      }

      this.updateTargetElement()

      if (this.targetEl) {
        if (this.popper) {
          this.popper.destroy()
        }

        let { box } = this.$refs
        if (!box) {
          return
        }

        this.popper = new Popper(this.targetEl, box, {
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
            ...omit(this.options, 'position', 'local')
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
    updateTargetElement () {
      if (this.target) {
        this.targetEl = getNodes(this.target, this.$vnode.context)[0]
      } else {
        this.targetEl = null
      }
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

      if (this.realOpen && this.$refs.box) {
        this.createFocusContext()
      }
    },
    createFocusContext () {
      if (!this.focusContext) {
        let { box } = this.$refs

        this.focusContext = focusManager.createContext(box, {
          source: box.ownerDocument.activeElement,
          trap: this.modal
        })

        this.lastSource = box.ownerDocument.activeElement
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
    },
    handleAfterOpen () {
      this.$nextTick(() => {
        this.initFocus()
        this.$emit('afteropen')
      })
    },
    handleAfterClose () {
      this.leaving = false
      this.$emit('afterclose')
    },
    handleLeaveCancelled () {
      this.leaving = false
    }
  },
  render () {
    const box = (
      <VEUI_OVERLAY_ELEMENT_NAME
        v-show={this.realOpen}
        style={this.realOverlayStyle}
        class={[[this.$c('overlay-box')], this.realOverlayClass]}
        ref="box"
        ui={this.realUi}
        {...{ on: omit(this.$listeners, EMITS) }}
      >
        {(this.realOpen || this.realLeaving) && this.$slots.default}
      </VEUI_OVERLAY_ELEMENT_NAME>
    )
    // 只有 open || closing 过程中 才会渲染内容

    return this.inline ? (
      box
    ) : (
      <div
        class={this.$c('overlay')}
        aria-hidden={this.local}
        v-show={this.local}
      >
        <transition
          name={this.$c('overlay')}
          appear
          onAfterLeave={this.handleAfterClose}
          onLeaveCancelled={this.handleLeaveCancelled}
        >
          {box}
        </transition>
      </div>
    )
  }
}
</script>

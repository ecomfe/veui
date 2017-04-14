<template>
  <div class="veui-overlay">
    <div class="veui-overlay-box"
      :class="overlayClass"
      :ui="ui"
      ref="box"
      :style="{zIndex}"
      v-show="overlayVisible">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import Tether from 'tether'
  import { omit, isObject, isString, isArray, isBoolean, find } from 'lodash'

  const ZINDEX_INSTANCE_KEY = '__veui_overlay_zindex_instance'

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
        validator (value) {
          return isBoolean(value) || isObject(value)
        },
        default: false
      },
      options: {
        type: Object,
        default () {
          return {}
        }
      },
      defaultOptions: {
        type: Object,
        default () {
          return {}
        }
      },
      targets: {
        type: Array,
        default: null
      }
    },
    data () {
      return {
        zIndex: 0,
        appendBody: false,
        overlayVisible: false,
        targetRef: null,
        targetIndex: null,
        targetNode: null,
        targetOptions: null
      }
    },
    computed: {
      isAttach () {
        return !!this.targets
      }
    },
    created () {
      this.$watch(
        'open',
        () => {
          this.updateOverlayData()
        },
        { deep: true }
      )
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
      updateOverlayData () {
        this.isOpenDirty = true
        this.overlayVisible = false

        if (this.isAttach && this.open) {
          const attachTarget = this.findAttachTarget()
          this.targetRef = attachTarget.targetRef
          this.targetIndex = attachTarget.targetIndex
          this.targetNode = this.findAttachTargetNode()
          this.targetOptions = this.getOptions(this.targetRef, this.targetIndex)

          if (this.targetNode) {
            this.overlayVisible = true
          }
        } else if (!this.isAttach && this.open) {
          this.overlayVisible = true
        }
      },

      updateOverlayDOM () {
        if ((this.isAttach && this.targetNode) || this.open) {
          this.closeOverlay()
          this.openOverlay()
        } else {
          this.closeOverlay()
        }
      },
      findAttachTarget () {
        // 找到第一个要求显示的元素
        let targetRef
        let targetIndex
        find(this.open, (visible, ref) => {
          if (isArray(visible)) {
            return find(visible, (v, index) => {
              if (v) {
                targetRef = ref
                targetIndex = index
                return true
              }
            })
          } else if (visible) {
            targetRef = ref
            targetIndex = 0
          }
        })

        return { targetRef, targetIndex }
      },

      findAttachTargetNode () {
        if (!this.targetRef) {
          return null
        }
        const targets = this.$vnode.context.$refs[this.targetRef]
        const target = isArray(targets) ? targets[this.targetIndex] : targets
        return target.$el || target
      },

      getOptions (targetRef, targetIndex) {
        if (!this.options[targetRef]) {
          return this.defaultOptions
        }

        if (isObject(this.options[targetRef])) {
          return targetIndex === 0 ? this.options[targetRef] : this.defaultOptions
        }

        if (isArray(this.options[targetRef])) {
          return this.options[targetRef][targetIndex] || this.defaultOptions
        }
      },

      createZIndexInstance (attach) {
        this[ZINDEX_INSTANCE_KEY] = this.$veui.addOverlay(attach ? this.findParentOverlayId() : null)
        this[ZINDEX_INSTANCE_KEY].$on(
          'zindexchange',
          zIndex => {
            this.zIndex = zIndex
          }
        )
        this[ZINDEX_INSTANCE_KEY].refresh()
      },

      openOverlay () {
        if (this.isAttach) {
          const targetNode = this.targetNode
          if (targetNode) {
            this.overlayVisible = true
            this.tether = new Tether({
              element: this.$refs.box,
              target: targetNode,
              ...omit(this.targetOptions, 'element', 'target')
            })
            this.$nextTick(() => this.tether.position())
            this.createZIndexInstance(true)
          }
        } else {
          this.overlayVisible = true
          this.createZIndexInstance(false)
        }
      },

      closeOverlay () {
        if (this.isAttach) {
          this.tether && this.tether.destroy()
          this.tether = null
        }

        this.overlayVisible = false

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

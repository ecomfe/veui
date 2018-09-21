<template>
  <veui-overlay
    ref="overlay"
    class="veui-dialog"
    :open="localOpen"
    :overlay-class="mergeOverlayClass({
      'veui-dialog-box': true,
      'veui-dialog-box-mask': modal
    })"
    :ui="ui"
    autofocus
    :modal="modal"
    :priority="priority"
    @afterclose="$emit('afterclose')">
    <div
      class="veui-dialog-content"
      ref="content"
      tabindex="-1"
      @mousedown="focus"
      @keydown.esc="handleEscape"
      v-bind="attrs">
      <div
        v-if="title || $slots.title"
        class="veui-dialog-content-head"
        :class="{ 'veui-dialog-draggable': draggable }"
        v-drag:content.translate="{ draggable, containment: '@window', ready: dragReady }">
        <h3 class="veui-dialog-content-head-title">
          <slot name="title">{{ title }}</slot>
        </h3>
      </div>
      <button
        type="button"
        class="veui-dialog-content-head-close"
        v-if="closable"
        @click="cancel"
        aria-label="关闭">
        <veui-icon :name="icons.close"/>
      </button>
      <div class="veui-dialog-content-body"><slot :close="close"/></div>
      <div class="veui-dialog-content-foot">
        <slot name="foot" :close="close">
          <veui-button :ui="uiParts.ok || 'primary'" @click="close('ok')">确定</veui-button>
          <veui-button :ui="uiParts.cancel" autofocus @click="cancel">取消</veui-button>
        </slot>
      </div>
    </div>
  </veui-overlay>
</template>

<script>
import Overlay from './Overlay'
import Button from './Button'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'
import drag from '../directives/drag'
import Icon from './Icon'

export default {
  name: 'veui-dialog',
  components: {
    'veui-overlay': Overlay,
    'veui-button': Button,
    'veui-icon': Icon
  },
  inheritAttrs: false,
  directives: { drag },
  mixins: [ui, overlay],
  props: {
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
    closable: {
      type: Boolean,
      default: true
    },
    escapable: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: false
    },
    priority: Number,
    beforeClose: Function
  },
  data () {
    return {
      localOpen: this.open
    }
  },
  computed: {
    attrs () {
      return {
        role: 'dialog',
        'aria-modal': String(this.modal),
        ...this.$attrs
      }
    }
  },
  watch: {
    open (val) {
      this.localOpen = val
    },
    localOpen (val) {
      if (this.open !== val) {
        this.$emit('update:open', val)
      }
    }
  },
  methods: {
    dragReady (handle) {
      this.dragHandle = handle
    },
    resetPosition () {
      if (!this.dragHandle) {
        throw new Error('The dialog is not ready for drag.')
      }

      this.dragHandle.reset()
    },
    focus () {
      let { overlay } = this.$refs
      if (overlay) {
        overlay.focus()
      }
    },
    close (type) {
      if (typeof type !== 'string') {
        type = 'cancel'
      }
      if (typeof this.beforeClose === 'function') {
        Promise.resolve(this.beforeClose(type)).then(result => {
          if (result !== false) {
            this.localOpen = false
          }
        })
      } else {
        this.localOpen = false
      }
      this.$emit(type)
    },
    cancel () {
      this.close('cancel')
    },
    handleEscape (e) {
      if (this.escapable) {
        e.stopPropagation()
        this.cancel()
      }
    }
  }
}
</script>

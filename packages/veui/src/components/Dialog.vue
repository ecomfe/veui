<template>
  <veui-overlay class="veui-dialog"
    :open="localOpen"
    :overlay-class="mergeOverlayClass({
      'veui-dialog-box': true,
      'veui-dialog-box-mask': modal
    })"
    :ui="ui"
    autofocus
    :modal="modal"
    :priority="priority">
    <div class="veui-dialog-content"
      ref="content"
      tabindex="-1"
      @keydown.esc="handleEscape"
      v-bind="attrs">
      <div class="veui-dialog-content-head"
        :class="{ 'veui-dialog-draggable': draggable }"
        v-drag:content.translate="{ draggable, containment: '@window', ready: dragReady }">
        <span class="veui-dialog-content-head-title"><slot name="title">{{ title }}</slot></span>
        <button type="button" class="veui-dialog-content-head-close"
          v-if="closable"
          @click="localOpen = false"
          aria-label="关闭">
          <veui-icon :name="icons.close"></veui-icon>
        </button>
      </div>
      <div class="veui-dialog-content-body"><slot></slot></div>
      <div class="veui-dialog-content-foot">
        <slot name="foot">
          <veui-button ui="primary" @click="$emit('ok')">确定</veui-button>
          <veui-button autofocus @click="$emit('cancel')">取消</veui-button>
        </slot>
      </div>
    </div>
  </veui-overlay>
</template>

<script>
import Overlay from './Overlay'
import Button from './Button'
import ui from '../mixins/ui'
import icons from '../mixins/icons'
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
  mixins: [ui, icons, overlay],
  props: {
    ui: String,
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
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    priority: Number
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
    },
    realEscapable () {
      return this.closable || this.escapable
    }
  },
  watch: {
    open (val) {
      this.localOpen = val
    },
    localOpen (val) {
      if (this.open !== val) {
        this.$emit('update:open', this.localOpen)
      }
    }
  },
  methods: {
    dragReady (handle) {
      this.dragHandle = handle
    },
    resetPosition () {
      if (!this.dragHandle) {
        throw new Error('The dialog is not ready for drag')
      }

      this.dragHandle.reset()
    },
    handleEscape (e) {
      if (this.realEscapable) {
        this.localOpen = false
        e.stopPropagation()
        this.$emit('escape')
      }
    }
  }
}
</script>

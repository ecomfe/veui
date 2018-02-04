<template>
  <veui-overlay class="veui-dialog"
    :open="localOpen"
    :overlay-class="mergeOverlayClass({
      'veui-dialog-box': true,
      'veui-dialog-box-mask': modal
    })"
    :ui="ui"
    ref="overlay"
    :priority="priority">
    <div class="veui-dialog-content"
      @mousedown="focus"
      ref="content">
      <div class="veui-dialog-content-head"
        :class="{ 'veui-dialog-draggable': draggable }"
        ref="head"
        v-drag:content.translate="{ draggable, containment: '@window', ready: dragReady }">
        <span class="veui-dialog-content-head-title"><slot name="title">{{ title }}</slot></span>
        <a class="veui-dialog-content-head-close"
          v-show="closable"
          @click="hide">
          <veui-icon :name="icons.close"></veui-icon>
        </a>
      </div>
      <div ref="body" class="veui-dialog-content-body"><slot></slot></div>
      <div ref="foot" class="veui-dialog-content-foot">
        <slot name="foot">
          <veui-button ui="primary" @click="$emit('ok')">确定</veui-button>
          <veui-button @click="$emit('cancel')">取消</veui-button>
        </slot>
      </div>
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
  watch: {
    open (value) {
      this.localOpen = value
    }
  },
  methods: {
    hide () {
      this.localOpen = false
      this.$emit('update:open', this.localOpen)
    },
    focus () {
      if (this.$refs.overlay) {
        this.$refs.overlay.focus()
      }
    },
    dragReady (handle) {
      this.dragHandle = handle
    },
    resetPosition () {
      if (!this.dragHandle) {
        throw new Error('The dialog is not ready for drag')
      }

      this.dragHandle.reset()
    }
  }
}
</script>

<template>
  <veui-overlay class="veui-dialog"
    :open="localOpen"
    :overlay-class="mergedOverlayClass"
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
        <span class="veui-dialog-content-head-title"
          v-if="localTitle"
          v-text="localTitle">
        </span>
        <span class="veui-dialog-content-head-title"
          v-else>
          <slot name="title">弹窗标题</slot>
        </span>
        <a class="veui-dialog-content-head-close"
          v-show="localClosable"
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
import { isObject, isString } from 'lodash'
import Overlay from './Overlay'
import Button from './Button'
import { ui, icons } from '../mixins'
import { drag } from '../directives'
import Icon from './Icon'
import { normalizeCSSClass } from '../utils/helper'

export default {
  name: 'veui-dialog',
  components: {
    'veui-overlay': Overlay,
    'veui-button': Button,
    'veui-icon': Icon
  },
  directives: { drag },
  mixins: [ui, icons],
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
    overlayClass: {
      validator (value) {
        return isObject(value) || isString(value)
      },
      default: null
    },
    priority: Number
  },
  data () {
    return {
      localOpen: this.open,
      localWidth: this.width,
      localClosable: this.closable,
      localHeight: this.height,
      localTitle: this.title || null
    }
  },
  watch: {
    title (value) {
      this.localTitle = value
    },
    open (value) {
      this.localOpen = value
    },
    width (value) {
      this.localWidth = value
    },
    height (value) {
      this.localHeight = value
    },
    closable (value) {
      this.localClosable = value
    }
  },
  computed: {
    mergedOverlayClass () {
      return {
        ...normalizeCSSClass(this.overlayClass),
        'veui-dialog-box': true,
        'veui-dialog-box-mask': this.modal
      }
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

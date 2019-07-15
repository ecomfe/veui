<template>
<veui-overlay
  ref="overlay"
  class="veui-dialog"
  :open="localOpen"
  :overlay-class="
    mergeOverlayClass({
      'veui-dialog-box': true,
      'veui-dialog-box-mask': modal
    })
  "
  :ui="realUi"
  autofocus
  :modal="modal"
  :priority="priority"
  @clickmask="$emit('clickmask')"
  @afterclose="$emit('afterclose')"
>
  <div
    ref="content"
    class="veui-dialog-content"
    tabindex="-1"
    v-bind="attrs"
    @mousedown="focus"
    @keydown.esc="handleEscape"
  >
    <div
      v-if="title || $slots.title || $scopedSlots.title"
      v-drag:content.translate="{
        draggable,
        containment: '@window',
        ready: dragReady
      }"
      class="veui-dialog-content-head"
      :class="{ 'veui-dialog-draggable': draggable }"
    >
      <h3 class="veui-dialog-content-head-title">
        <slot
          name="title"
          :close="close"
        >
          {{ title }}
        </slot>
      </h3>
    </div>
    <button
      v-if="closable"
      type="button"
      class="veui-dialog-content-head-close"
      :aria-label="t('close')"
      @click="cancel"
    >
      <veui-icon :name="icons.close"/>
    </button>
    <div class="veui-dialog-content-body">
      <slot :close="close"/>
    </div>
    <div class="veui-dialog-content-foot">
      <slot
        name="foot"
        :close="close"
      >
        <veui-button
          :ui="uiParts.ok"
          @click="close('ok')"
        >
          {{ t("ok") }}
        </veui-button>
        <veui-button
          :ui="uiParts.cancel"
          autofocus
          @click="cancel"
        >
          {{ t("cancel") }}
        </veui-button>
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
import focusable from '../mixins/focusable'
import i18n from '../mixins/i18n'
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
  mixins: [ui, overlay, focusable, i18n],
  inheritAttrs: false,
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
        'aria-modal': this.modal,
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

<template>
<veui-overlay
  ref="overlay"
  :class="$c('dialog')"
  :open="realOpen"
  :overlay-class="
    mergeOverlayClass({
      [$c('dialog-box')]: true,
      [$c('dialog-box-mask')]: modal,
      [$c('dialog-inline')]: inline
    })
  "
  :ui="realUi"
  autofocus
  :inline="inline"
  :modal="modal"
  :priority="priority"
  @afterclose="handleAfterClose"
>
  <div
    ref="content"
    v-outside="outside"
    :class="$c('dialog-content')"
    tabindex="-1"
    v-bind="attrs"
    @mousedown="focus"
    @keydown.esc="handleEscape"
  >
    <div
      v-drag:content.translate="{
        draggable,
        containment: '@window',
        ready: dragReady
      }"
      :class="{
        [$c('dialog-content-head')]: true,
        [$c('dialog-draggable')]: draggable
      }"
    >
      <h3
        v-if="title || $slots.title || $scopedSlots.title"
        :class="$c('dialog-content-head-title')"
      >
        <slot
          name="title"
          :close="close"
        >
          {{ title }}
        </slot>
      </h3>
      <veui-button
        v-if="closable"
        :ui="uiParts.close"
        :class="$c('dialog-content-head-close')"
        :aria-label="t('close')"
        @click="cancel"
      >
        <veui-icon :name="icons.close"/>
      </veui-button>
    </div>
    <div :class="$c('dialog-content-body')">
      <slot :close="close"/>
    </div>
    <div
      v-if="!footless"
      :class="$c('dialog-content-foot')"
    >
      <slot
        name="foot"
        :close="close"
      >
        <veui-button
          :ui="uiParts.ok"
          :loading="loading"
          @click="close('ok')"
        >
          {{ t('ok') }}
        </veui-button>
        <veui-button
          :ui="uiParts.cancel"
          autofocus
          @click="cancel"
        >
          {{ t('cancel') }}
        </veui-button>
      </slot>
    </div>
  </div>
</veui-overlay>
</template>

<script>
import Overlay from './Overlay'
import Button from './Button'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'
import focusable from '../mixins/focusable'
import i18n from '../mixins/i18n'
import modal from '../managers/modal'
import outside from '../directives/outside'
import drag from '../directives/drag'
import Icon from './Icon'
import useControllable from '../mixins/controllable'

export default {
  name: 'veui-dialog',
  components: {
    'veui-overlay': Overlay,
    'veui-button': Button,
    'veui-icon': Icon
  },
  directives: { outside, drag },
  mixins: [prefix, ui, overlay, focusable, i18n, useControllable(['open'])],
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
    inline: Boolean,
    outsideClosable: Boolean,
    draggable: {
      type: Boolean,
      default: false
    },
    priority: Number,
    beforeClose: Function,
    footless: Boolean,
    loading: Boolean
  },
  computed: {
    attrs () {
      return {
        role: 'dialog',
        'aria-modal': !this.inline && this.modal,
        ...this.$attrs
      }
    }
  },
  watch: {
    realOpen (val) {
      if (this.modal) {
        if (val) {
          modal.open()
        }
      }
    }
  },
  mounted () {
    if (this.realOpen && this.modal) {
      modal.open()
    }
  },
  destroyed () {
    if (this.realOpen && this.modal) {
      modal.close()
    }
  },
  methods: {
    dragReady ({ reset }) {
      this.resetDrag = reset
    },
    resetPosition () {
      if (!this.resetDrag) {
        throw new Error('The dialog is not ready for drag.')
      }

      this.resetDrag()
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
            this.commit('open', false)
          }
        })
      } else {
        this.commit('open', false)
      }
      this.$emit(type)
    },
    outside () {
      if (this.outsideClosable && this.realOpen) {
        this.cancel()
      }
    },
    cancel () {
      this.close('cancel')
    },
    handleEscape (e) {
      if (this.escapable) {
        e.stopPropagation()
        this.cancel()
      }
    },
    handleAfterClose () {
      modal.close()
      this.$emit('afterclose')
    }
  }
}
</script>

<template>
<div
  v-if="localOpen"
  class="veui-alert"
  :ui="realUi"
  :class="`veui-alert-${type}`"
  role="alert"
  aria-expanded="true"
>
  <slot name="content">
    <div class="veui-alert-state">
      <veui-icon
        class="veui-alert-icon"
        :name="icons[type]"
      />
    </div>
    <div
      v-if="isMultiple"
      class="veui-alert-message veui-alert-message-multiple"
    >
      <slot
        :index="localIndex"
        :message="message[localIndex]"
      >
        {{ message[localIndex] }}
      </slot>
    </div>
    <div
      v-else
      class="veui-alert-message"
    >
      <slot :message="message">
        {{ message }}
      </slot>
    </div>

    <div
      v-if="isMultiple"
      class="veui-alert-nav"
    >
      <veui-button
        :ui="uiParts.prev"
        :disabled="isFirst"
        :aria-label="t('prev')"
        @click="switchMessage(-1)"
      >
        <veui-icon :name="icons.prev"/>
      </veui-button>
      <span
        class="veui-alert-nav-indicator"
        :aria-label="t('indicator', {
          index: localIndex + 1,
          total: message.length
        })"
      >
        {{ localIndex + 1 }}/{{ message.length }}
      </span>
      <veui-button
        :ui="uiParts.next"
        :disabled="isLast"
        :aria-label="t('next')"
        @click="switchMessage(1)"
      >
        <veui-icon :name="icons.next"/>
      </veui-button>
    </div>

    <div
      v-if="closable"
      class="veui-alert-close"
    >
      <veui-button
        v-if="realCloseLabel"
        class="veui-alert-close-text"
        :ui="uiParts.close"
        @click="close"
      >
        {{ realCloseLabel }}
      </veui-button>
      <veui-button
        v-else
        :ui="uiParts.closeLabel"
        :aria-label="t('close')"
        @click="close"
      >
        <veui-icon :name="icons.close"/>
      </veui-button>
    </div>
  </slot>
</div>
</template>

<script>
import Icon from './Icon'
import Button from './Button'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import warn from '../utils/warn'

export default {
  name: 'alert',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [ui, i18n],
  props: {
    type: {
      type: String,
      default: 'success'
    },
    message: [String, Array],
    closable: Boolean,
    closeLabel: String,
    closeText: {
      type: String,
      validator (val) {
        if (val != null) {
          warn('[veui-alert] `close-text` is deprecated and will be removed in `1.0.0`. Use `close-label` instead.', this)
        }
      }
    },
    open: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      localOpen: this.open,
      localIndex: 0
    }
  },
  computed: {
    realCloseLabel () {
      return this.closeLabel || this.closeText
    },
    isMultiple () {
      return Array.isArray(this.message)
    },
    isFirst () {
      return this.localIndex <= 0
    },
    isLast () {
      return this.localIndex >= this.message.length - 1
    }
  },
  watch: {
    open (value) {
      this.localOpen = value
    },
    index: {
      handler (value) {
        this.localIndex = value
      },
      immediate: true
    },
    localIndex (value) {
      this.$emit('update:index', value)
    }
  },
  methods: {
    close () {
      this.localOpen = false
      this.$emit('update:open', false)
      this.$emit('close')
    },
    switchMessage (step) {
      if ((step > 0 && this.isLast) || (step < 0 && this.isFirst)) {
        return
      }
      this.localIndex = this.localIndex + step
    }
  }
}
</script>

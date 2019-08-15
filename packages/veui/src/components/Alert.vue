<template>
<div
  v-if="localOpen"
  class="veui-alert"
  :ui="realUi"
  :class="`veui-alert-${type}${isTitled ? ' veui-alert-titled' : ''}`"
  role="alert"
  aria-expanded="true"
>
  <slot name="content">
    <div
      v-if="showIcon"
      class="veui-alert-state"
    >
      <veui-icon
        class="veui-alert-icon"
        :name="icons[type]"
      />
    </div>
    <div
      v-if="isMultiple"
      class="veui-alert-content veui-alert-content-multiple"
    >
      <slot
        :index="localIndex"
        :message="message[localIndex]"
      >
        {{ message[localIndex] }}
      </slot>
      <div
        v-if="$slots.extra || $scopedSlots.extra"
        class="veui-alert-content-extra"
      >
        <slot
          name="extra"
          :index="localIndex"
          :message="message[localIndex]"
        />
      </div>
    </div>
    <div
      v-else
      class="veui-alert-content"
    >
      <div
        v-if="title || $slots.title"
        class="veui-alert-content-title"
      >
        <template v-if="title">
          {{ title }}
        </template>
        <slot
          v-else
          name="title"
        />
      </div>
      <div class="veui-alert-content-message">
        <slot :message="message">
          {{ message }}
        </slot>
        <div
          v-if="$slots.extra"
          class="veui-alert-content-extra"
        >
          <slot name="extra"/>
        </div>
      </div>
    </div>

    <div
      v-if="isMultiple"
      class="veui-alert-nav"
    >
      <veui-button
        :ui="uiParts.prev"
        :disabled="isFirst"
        @click="switchMessage(-1)"
      >
        <veui-icon :name="icons.prev"/>
      </veui-button>
      <span class="veui-alert-nav-indicator">
        <span class="veui-alert-nav-indicator-current">{{
          localIndex + 1
        }}</span>/{{ message.length }}
      </span>
      <veui-button
        :ui="uiParts.next"
        :disabled="isLast"
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
        :ui="uiParts.close"
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
    title: String,
    message: [String, Array],
    closable: Boolean,
    showIcon: {
      type: Boolean,
      default: true
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
    isMultiple () {
      return Array.isArray(this.message)
    },
    isFirst () {
      return this.localIndex <= 0
    },
    isLast () {
      return this.localIndex >= this.message.length - 1
    },
    isTitled () {
      return this.title || this.$slots.title
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

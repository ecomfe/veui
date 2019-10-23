<template>
<div
  v-if="localOpen"
  :ui="realUi"
  :class="{
    [$c('alert')]: true,
    [$c(`alert-${type}`)]: true,
    [$c('alert-titled')]: isTitled,
    [$c('alert-multiline')]: multiline
  }"
  role="alert"
  aria-expanded="true"
>
  <slot name="content">
    <div :class="$c('alert-state')">
      <veui-icon
        :class="$c('alert-icon')"
        :name="icons[type]"
      />
    </div>
    <div
      v-if="isMultiple"
      :class="`${$c('alert-content')} ${$c('alert-content-multiple')}`"
    >
      <slot
        :index="localIndex"
        :message="message[localIndex]"
      >
        {{ message[localIndex] }}
      </slot>
      <div
        v-if="$slots.extra || $scopedSlots.extra"
        :class="$c('alert-content-extra')"
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
      :class="$c('alert-content')"
    >
      <div
        v-if="title || $slots.title"
        :class="$c('alert-content-title')"
      >
        <template v-if="title">
          {{ title }}
        </template>
        <slot
          v-else
          name="title"
        />
      </div>
      <div
        ref="message"
        :class="$c('alert-content-message')"
      >
        <slot :message="message">
          {{ message }}
        </slot>
        <div
          v-if="$slots.extra"
          :class="$c('alert-content-extra')"
        >
          <slot name="extra"/>
        </div>
      </div>
    </div>

    <div
      v-if="isMultiple"
      :class="$c('alert-nav')"
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
        :class="$c('alert-nav-indicator')"
        :aria-label="
          t('indicator', {
            index: localIndex + 1,
            total: message.length
          })
        "
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
      :class="$c('alert-close')"
    >
      <veui-button
        :ui="uiParts.close"
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
import prefix from '../mixins/prefix'

export default {
  name: 'alert',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [prefix, ui, i18n],
  props: {
    type: {
      type: String,
      default: 'success'
    },
    title: String,
    message: [String, Array],
    closable: Boolean,
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
      localIndex: 0,
      multiline: false
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
  mounted () {
    let { message } = this.$refs
    if (message) {
      this.multiline = message.getClientRects().length > 1
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

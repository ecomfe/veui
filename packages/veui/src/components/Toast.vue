<template>
<transition
  :name="$c('toast')"
  appear
>
  <div
    v-if="localOpen"
    :ui="realUi"
    :class="{
      [$c('toast')]: true,
      [$c(`toast-${type}`)]: true,
      [$c('toast-titled')]: isTitled,
      [$c('toast-multiline')]: multiline
    }"
    role="alert"
  >
    <div :class="$c('toast-state')">
      <veui-icon
        :class="$c('toast-icon')"
        :name="icons[type]"
      />
    </div>
    <div :class="$c('toast-content')">
      <div
        v-if="title || $slots.title"
        :class="$c('toast-content-title')"
      >
        <slot
          name="title"
          :close="close"
        >{{ title }}</slot>
      </div>
      <div
        ref="message"
        :class="$c('toast-content-message')"
      >
        <slot :close="close">{{ message }}</slot>
      </div>
    </div>
    <div
      v-if="closable"
      :class="$c('toast-close')"
    >
      <veui-button
        :ui="uiParts.close"
        :aria-label="t('close')"
        @click="close"
      >
        <veui-icon :name="icons.close"/>
      </veui-button>
    </div>
  </div>
</transition>
</template>

<script>
import Icon from './Icon'
import Button from './Button'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import config from '../managers/config'
import { includes } from 'lodash'

config.defaults(
  {
    duration: 3000
  },
  'toast'
)

const TYPE_LIST = ['success', 'warning', 'info', 'error']

export default {
  name: 'veui-toast',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [prefix, ui, i18n],
  props: {
    type: {
      type: String,
      default: 'success',
      validator (val) {
        return includes(TYPE_LIST, val)
      }
    },
    title: String,
    closable: Boolean,
    message: String,
    open: Boolean,
    duration: {
      type: Number,
      default: config.get('toast.duration')
    }
  },
  data () {
    return {
      localOpen: this.open,
      multiline: false
    }
  },
  computed: {
    isTitled () {
      return this.title || this.$slots.title
    }
  },
  watch: {
    open (value) {
      this.localOpen = value
    }
  },
  mounted () {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        this.$emit('update:open', false)
        this.$emit('close')
      }, this.duration)
    }

    let { message } = this.$refs
    if (message) {
      this.multiline = message.getClientRects().length > 1
    }

    this.$emit('ready', this.$el)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    close () {
      this.localOpen = false
      this.$emit('update:open', false)
      this.$emit('close')
    }
  }
}
</script>

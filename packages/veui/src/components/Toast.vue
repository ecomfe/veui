<template>
<transition name="veui-toast">
  <div
    v-if="localOpen"
    :ui="realUi"
    class="veui-toast"
    :class="{
      [`veui-toast-${type}`]: true,
      'veui-toast-titled': isTitled,
      'veui-toast-multiline': multiline
    }"
    role="alert"
  >
    <div class="veui-toast-state">
      <veui-icon
        class="veui-toast-icon"
        :name="icons[type]"
      />
    </div>
    <div class="veui-toast-content">
      <div
        v-if="title || $slots.title"
        class="veui-toast-content-title"
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
        class="veui-toast-content-message"
      >
        <slot>{{ message }}</slot>
      </div>
    </div>
    <div
      v-if="closable"
      class="veui-toast-close"
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
  name: 'toast',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [ui, i18n],
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
    this.timer = setTimeout(() => {
      this.$emit('update:open', false)
      this.$emit('close')
    }, this.duration)

    let { message } = this.$refs
    if (message) {
      this.multiline = message.getClientRects().length > 1
    }

    this.$emit('ready', this.$el.offsetHeight)
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

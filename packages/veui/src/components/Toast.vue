<template>
<transition :name="$c('toast')" appear>
  <div
    v-if="realOpen"
    :ui="realUi"
    :class="{
      [$c('toast')]: true,
      [$c(`toast-${realStatus}`)]: true,
      [$c('toast-titled')]: isTitled(),
      [$c('toast-multiline')]: multiline
    }"
    role="alert"
  >
    <div :class="$c('toast-state')">
      <veui-icon :class="$c('toast-icon')" :name="icons[realStatus]"/>
    </div>
    <div :class="$c('toast-content')">
      <div v-if="title || $slots.title" :class="$c('toast-content-title')">
        <slot name="title" :close="close">{{ title }}</slot>
      </div>
      <div ref="message" :class="$c('toast-content-message')">
        <slot :close="close">{{ message }}</slot>
      </div>
    </div>
    <div v-if="closable" :class="$c('toast-close')">
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
import useControllable from '../mixins/controllable'
import config from '../managers/config'
import useConfig from '../mixins/config'
import { useRename } from '../mixins/deprecate'
import { includes } from 'lodash'
import '../common/global'

config.defaults(
  {
    duration: 3000
  },
  'toast'
)

const STATUS_LIST = ['success', 'warning', 'info', 'error']

export default {
  name: 'veui-toast',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [
    ui,
    i18n,
    useControllable(['open']),
    useConfig('config', 'toast'),
    useRename(
      {
        type: String,
        default: 'success',
        validator (val) {
          return includes(STATUS_LIST, val)
        }
      },
      {
        from: 'type',
        to: 'status'
      }
    )
  ],
  props: {
    title: String,
    closable: Boolean,
    message: String,
    open: Boolean,
    duration: {
      type: Number
    }
  },
  data () {
    return {
      multiline: false
    }
  },
  computed: {
    realDuration () {
      return this.duration == null
        ? this.config['toast.duration']
        : this.duration
    }
  },
  mounted () {
    if (this.realDuration > 0) {
      this.timer = setTimeout(() => {
        this.$emit('update:open', false)
        this.$emit('close')
      }, this.realDuration)
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
    isTitled () {
      return this.title || this.$slots.title
    },
    close () {
      this.commit('open', false)
      this.$emit('close')
    }
  }
}
</script>

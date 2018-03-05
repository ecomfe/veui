<template>
<div v-if="localOpen" class="veui-alert" :ui="ui" :class="`veui-alert-${type}`"
  role="alert" aria-expanded="true">
  <slot name="content">
    <veui-icon class="veui-alert-icon" :name="icons[type]"></veui-icon>

    <span v-if="isMultiple" class="veui-alert-message veui-alert-message-multiple">
      <slot :index="localIndex" :message="message[localIndex]">{{ message[localIndex] }}</slot>
    </span>
    <span v-else class="veui-alert-message">
      <slot v-if="$scopedSlots.default" :message="message">{{ message }}</slot>
      <slot v-else>{{ message }}</slot>
    </span>

    <veui-button v-if="closeText" class="veui-alert-close veui-alert-close-text" ui="link primary" @click="close">{{ closeText }}</veui-button>
    <span class="veui-alert-nav" v-else-if="isMultiple">
      <veui-button ui="link" :disabled="isFirst" @click="switchMessage(-1)">
        <veui-icon :name="icons.prev"></veui-icon>
      </veui-button>
      <span>{{ localIndex + 1 }}/{{ message.length }}</span>
      <veui-button ui="link" :disabled="isLast" @click="switchMessage(1)">
        <veui-icon :name="icons.next"></veui-icon>
      </veui-button>
    </span>
    <veui-button v-else class="veui-alert-close" ui="link" @click="close">
      <veui-icon :name="icons.close"></veui-icon>
    </veui-button>
  </slot>
</div>
</template>

<script>
import Icon from './Icon'
import Button from './Button'
import { isArray } from 'lodash'
import icons from '../mixins/icons'

export default {
  name: 'alert',
  mixins: [icons],
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  props: {
    ui: String,
    type: {
      type: String,
      default: 'success'
    },
    message: [String, Array],
    closeText: String,
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
  computed: {
    isMultiple () {
      return isArray(this.message)
    },
    isFirst () {
      return this.localIndex <= 0
    },
    isLast () {
      return this.localIndex >= this.message.length - 1
    }
  },
  methods: {
    close () {
      this.localOpen = false
      this.$emit('update:open', false)
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

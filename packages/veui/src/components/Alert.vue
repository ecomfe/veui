<template>
<div v-if="localOpen" class="veui-alert" :ui="ui" :class="`veui-alert-${type}`">
  <slot name="content">
    <veui-icon class="veui-alert-icon" :name="icons[type]"></veui-icon>
    <slot>
      <span v-if="isMultiple" class="veui-alert-message veui-alert-message-multiple">{{ message[index] }}</span>
      <span v-else class="veui-alert-message">{{ message }}</span>
    </slot>
    <button v-if="closeText" class="veui-alert-close veui-alert-close-text" @click="close">{{ closeText }}</button>
    <template v-else-if="isMultiple">
      <span class="veui-alert-close">
        <button :disabled="isFirst" @click="switchMessage(-1)">
          <veui-icon :name="icons.prev"></veui-icon>
        </button>
        <button :disabled="isLast" @click="switchMessage(1)">
          <veui-icon :name="icons.next"></veui-icon>
        </button>
      </span>
    </template>
    <button v-else class="veui-alert-close" @click="close">
      <veui-icon :name="icons.close"></veui-icon>
    </button>
  </slot>
</div>
</template>

<script>
import Icon from './Icon'
import { isArray } from 'lodash'
import { icons } from '../mixins'

export default {
  name: 'alert',
  mixins: [icons],
  components: {
    'veui-icon': Icon
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
    }
  },
  data () {
    return {
      localOpen: this.open,
      index: 0
    }
  },
  watch: {
    open (value) {
      this.localOpen = value
    }
  },
  computed: {
    isMultiple () {
      return isArray(this.message)
    },
    isFirst () {
      return this.index <= 0
    },
    isLast () {
      return this.index >= this.message.length - 1
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
      this.index = this.index + step
    }
  }
}
</script>

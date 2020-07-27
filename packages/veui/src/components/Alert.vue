<template>
<div
  v-if="realOpen"
  :ui="realUi"
  :class="{
    [$c('alert')]: true,
    [$c(`alert-${type}`)]: true,
    [$c('alert-titled')]: !!(title || $slots.title),
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
        :index="realIndex"
        :message="message[realIndex]"
        :close="close"
      >
        {{ message[realIndex] }}
      </slot>
      <div
        v-if="$scopedSlots.extra || $slots.extra"
        :class="$c('alert-content-extra')"
      >
        <slot
          name="extra"
          :index="realIndex"
          :message="message[realIndex]"
          :close="close"
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
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        ref="message"
        :class="$c('alert-content-message')"
      >
        <slot
          :message="message"
          :close="close"
        >
          {{ message }}
        </slot>
        <div
          v-if="$scopedSlots.extra || $slots.extra"
          :class="$c('alert-content-extra')"
        >
          <slot
            name="extra"
            :message="message"
            :close="close"
          />
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
            index: realIndex + 1,
            total: message.length
          })
        "
      >
        {{ realIndex + 1 }}/{{ message.length }}
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
import { clamp } from 'lodash'
import Icon from './Icon'
import Button from './Button'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import prefix from '../mixins/prefix'
import useControllable from '../mixins/controllable'

export default {
  name: 'alert',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [prefix, ui, i18n, useControllable(['open', 'index'])],
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
      multiline: false
    }
  },
  computed: {
    isMultiple () {
      return Array.isArray(this.message)
    },
    isFirst () {
      return this.realIndex <= 0
    },
    isLast () {
      return this.realIndex >= this.message.length - 1
    }
  },
  watch: {
    message (value) {
      let length = Array.isArray(value) ? value.length : 1
      this.setReal('index', clamp(this.realIndex, 0, length - 1))
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
      this.setReal('open', false)
      this.$emit('close')
    },
    switchMessage (step) {
      if ((step > 0 && this.isLast) || (step < 0 && this.isFirst)) {
        return
      }
      this.setReal('index', this.realIndex + step)
    }
  }
}
</script>

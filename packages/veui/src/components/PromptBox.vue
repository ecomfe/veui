<template>
<veui-dialog
  ref="dialog"
  :ui="realUi"
  :overlay-class="mergeOverlayClass($c('prompt-box'))"
  :open.sync="localOpen"
  :priority="priority"
  :closable="false"
  :before-close="beforeClose"
  :loading="loading"
  role="alertdialog"
  @ok="ok"
  @cancel="cancel"
  @afterclose="$emit('afterclose')"
>
  <template slot="title">
    <template v-if="title">
      {{ title }}
    </template>
    <slot
      v-else
      name="title"
    />
  </template>
  <div
    v-if="content || $slots.default"
    :class="$c('prompt-box-info')"
  >
    <slot>{{ content }}</slot>
  </div>
  <veui-input
    v-model="localValue"
    autofocus
    :invalid="invalid"
    :class="$c('prompt-box-input')"
    @keydown.enter="trigger"
  />
  <template slot="foot">
    <slot name="foot"/>
  </template>
</veui-dialog>
</template>

<script>
import Input from './Input'
import Dialog from './Dialog'
import { pick } from 'lodash'
import config from '../managers/config'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'

config.defaults({
  'promptbox.priority': 100
})

export default {
  name: 'veui-prompt-box',
  components: {
    'veui-input': Input,
    'veui-dialog': Dialog
  },
  mixins: [prefix, ui, overlay],
  props: {
    ...pick(Dialog.props, ['open', 'title', 'beforeClose', 'loading']),
    content: String,
    value: {
      type: String,
      default: ''
    },
    invalid: Boolean
  },
  data () {
    return {
      localOpen: this.open,
      priority: config.get('promptbox.priority'),
      localValue: this.value
    }
  },
  watch: {
    open (value) {
      this.localOpen = value
    },
    value (value) {
      this.localValue = value
    },
    localOpen (value) {
      this.$emit('update:open', value)
      if (!value) {
        this.localValue = ''
      }
    },
    localValue (value) {
      this.$emit('input', value)
    }
  },
  methods: {
    trigger () {
      this.$refs.dialog.close('ok')
    },
    ok () {
      this.$emit('ok', this.localValue)
    },
    cancel () {
      this.$emit('cancel', this.localValue)
    }
  }
}
</script>

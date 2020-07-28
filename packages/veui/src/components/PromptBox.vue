<template>
<veui-dialog
  ref="dialog"
  :ui="realUi"
  :overlay-class="mergeOverlayClass($c('prompt-box'))"
  :open.sync="realOpen"
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
    <slot name="title">{{ title }}</slot>
  </template>
  <div
    v-if="content || $slots.default"
    :class="$c('prompt-box-info')"
  >
    <slot>{{ content }}</slot>
  </div>
  <veui-input
    v-model="realValue"
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
import useControllable from '../mixins/controllable'

config.defaults({
  'promptbox.priority': 100
})

export default {
  name: 'veui-prompt-box',
  components: {
    'veui-input': Input,
    'veui-dialog': Dialog
  },
  mixins: [prefix, ui, overlay, useControllable([
    'open',
    {
      prop: 'value',
      event: 'input'
    }
  ])],
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
      priority: config.get('promptbox.priority')
    }
  },
  watch: {
    realOpen (value) {
      if (!value) {
        this.setReal('value', this.realValue)
      }
    }
  },
  methods: {
    trigger () {
      if (!this.loading) {
        this.$refs.dialog.close('ok')
      }
    },
    ok () {
      this.$emit('ok', this.realValue)
    },
    cancel () {
      this.$emit('cancel', this.realValue)
    }
  }
}
</script>

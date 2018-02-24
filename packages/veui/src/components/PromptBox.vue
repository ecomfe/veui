<template>
<veui-dialog :overlay-class="mergeOverlayClass('veui-prompt-box')"
  :ui="ui"
  :open.sync="localOpen"
  :priority="priority"
  :closable="false"
  @ok="submit"
  escapable
  @escape="cancel"
  @cancel="cancel"
  role="alertdialog">
  <template slot="title">
    <slot name="title">{{ title }}</slot>
  </template>
  <p class="veui-prompt-box-info">{{ content }}</p>
  <veui-input autofocus v-model="localValue" class="veui-prompt-box-input" @keydown.enter="submit"></veui-input>
</veui-dialog>
</template>

<script>
import Input from './Input'
import Dialog from './Dialog'
import { pick, extend } from 'lodash'
import config from '../managers/config'
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
  mixins: [overlay],
  props: extend(
    pick(Dialog.props, ['open', 'title', 'ui']),
    {
      content: {
        type: String,
        default: '请输入'
      },
      value: {
        type: String,
        default: ''
      }
    }
  ),
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
    },
    localValue (value) {
      this.$emit('input', value)
    }
  },
  methods: {
    submit () {
      this.$emit('ok')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

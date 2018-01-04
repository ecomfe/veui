<template>
<veui-dialog :overlay-class="mergeOverlayClass('veui-prompt-box')"
  :ui="ui"
  :open.sync="localOpen"
  :priority="priority"
  :closable="false"
  @ok="$emit('ok')"
  @cancel="$emit('cancel')">
  <template slot="title"><slot name="title">{{ title }}</slot></template>
  <p class="veui-prompt-box-info">{{ content }}</p>
  <veui-input v-model="localValue" class="veui-prompt-box-input"></veui-input>
</veui-dialog>
</template>

<script>
import Input from './Input'
import Dialog from './Dialog'
import { pick, extend } from 'lodash'
import config from '../managers/config'
import { overlay } from '../mixins'

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
  }
}
</script>

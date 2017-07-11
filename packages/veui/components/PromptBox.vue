<template>
  <veui-dialog class="veui-promptbox"
    :ui="ui"
    :open.sync="localOpen"
    :priority="priority"
    :closable="false"
    :width="340"
    @ok="$emit('ok')"
    @cancel="$emit('cancel')">
    <template slot="title"><slot name="title">{{ title }}</slot></template>
    <p class="veui-promptbox-info">{{ content }}</p>
    <veui-input v-model="localValue" class="veui-promptbox-input"></veui-input>
  </veui-dialog>
</template>

<script>
import Input from './Input'
import Dialog from './Dialog'
import { pick, extend } from 'lodash'
import { config } from '../managers'

config.defaults({
  'promptbox.priority': 100
})

export default {
  name: 'veui-promptbox',
  components: {
    'veui-input': Input,
    'veui-dialog': Dialog
  },
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
    open (v) {
      this.localOpen = v
    },
    value (v) {
      this.localValue = v
    },
    localOpen (v) {
      this.$emit('update:open', v)
    },
    localValue (v) {
      this.$emit('input', v)
    }
  }
}
</script>

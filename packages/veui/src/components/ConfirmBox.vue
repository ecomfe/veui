<template>
<veui-dialog ui="reverse"
  :open.sync="localOpen"
  :priority="priority"
  :closable="false"
  escapable
  :overlay-class="mergeOverlayClass('veui-confirm-box')"
  role="alertdialog">
  <template slot="title">
    <slot name="title">{{ title }}</slot>
  </template>
  <slot></slot>
  <template slot="foot">
    <veui-button ui="primary" @click="ok()">确定</veui-button>
    <veui-button autofocus @click="cancel()">取消</veui-button>
  </template>
</veui-dialog>
</template>

<script>
import { pick } from 'lodash'
import Dialog from './Dialog'
import Button from './Button'
import config from '../managers/config'
import overlay from '../mixins/overlay'

config.defaults({
  'confirmbox.priority': 100
})

export default {
  name: 'veui-confirm-box',
  components: {
    'veui-dialog': Dialog,
    'veui-button': Button
  },
  mixins: [overlay],
  props: {
    ...pick(Dialog.props, ['open', 'title']),
    ui: {
      type: String,
      default: 'reverse'
    }
  },
  data () {
    return {
      localOpen: this.open,
      localTitle: this.title,
      priority: config.get('confirmbox.priority')
    }
  },
  watch: {
    open (value) {
      this.localOpen = value
    },
    localOpen (value) {
      this.$emit('update:open', value)
    }
  },
  methods: {
    ok () {
      this.$emit('ok')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

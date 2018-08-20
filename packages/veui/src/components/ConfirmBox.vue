<template>
<veui-dialog
  :ui="ui"
  :overlay-class="mergeOverlayClass('veui-confirm-box')"
  :open.sync="localOpen"
  :priority="priority"
  :closable="false"
  :before-close="beforeClose"
  @ok="$emit('ok')"
  @cancel="$emit('cancel')"
  @afterclose="$emit('afterclose')"
  role="alertdialog">
  <template slot="title">
    <template v-if="title">{{ title }}</template>
    <slot name="title" v-else/>
  </template>
  <slot/>
  <template v-if="$slots.foot || $scopedSlots.foot" slot="foot" slot-scope="scope">
    <slot name="foot" v-bind="scope"/>
  </template>
</veui-dialog>
</template>

<script>
import { pick } from 'lodash'
import Dialog from './Dialog'
import Button from './Button'
import config from '../managers/config'
import ui from '../mixins/ui'
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
  mixins: [ui, overlay],
  props: pick(Dialog.props, ['open', 'title', 'beforeClose']),
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
  }
}
</script>

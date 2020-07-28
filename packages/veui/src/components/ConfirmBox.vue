<template>
<veui-dialog
  :ui="realUi"
  :overlay-class="mergeOverlayClass($c('confirm-box'))"
  :open.sync="realOpen"
  :priority="priority"
  :closable="false"
  :loading="loading"
  :before-close="beforeClose"
  role="alertdialog"
  @ok="$emit('ok')"
  @cancel="$emit('cancel')"
  @afterclose="$emit('afterclose')"
>
  <template
    v-if="title || $slots.title"
    slot="title"
  >
    <slot name="title">{{ title }}</slot>
  </template>
  <slot/>
  <template
    v-if="$slots.foot || $scopedSlots.foot"
    slot="foot"
    slot-scope="scope"
  >
    <slot
      name="foot"
      v-bind="scope"
    />
  </template>
</veui-dialog>
</template>

<script>
import { pick } from 'lodash'
import Dialog from './Dialog'
import config from '../managers/config'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'
import useControllable from '../mixins/controllable'

config.defaults({
  'confirmbox.priority': 100
})

export default {
  name: 'veui-confirm-box',
  components: {
    'veui-dialog': Dialog
  },
  mixins: [prefix, ui, overlay, useControllable(['open'])],
  props: pick(Dialog.props, ['open', 'title', 'beforeClose', 'loading']),
  data () {
    return {
      localTitle: this.title,
      priority: config.get('confirmbox.priority')
    }
  }
}
</script>

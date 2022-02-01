<template>
<veui-dialog
  :ui="realUi"
  :overlay-class="mergeOverlayClass($c('confirm-box'))"
  :overlay-style="overlayStyle"
  :open.sync="realOpen"
  :priority="priority"
  :closable="false"
  :before-close="beforeClose"
  :loading="loading"
  :disabled="disabled"
  :ok-label="okLabel"
  :cancel-label="cancelLabel"
  role="alertdialog"
  v-on="listeners"
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
import useConfig from '../mixins/config'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'
import useControllable from '../mixins/controllable'
import '../common/global'

config.defaults(
  {
    priority: 100
  },
  'confirmbox'
)

export default {
  name: 'veui-confirm-box',
  components: {
    'veui-dialog': Dialog
  },
  mixins: [
    prefix,
    ui,
    overlay,
    useControllable(['open']),
    useConfig('config', 'confirmbox')
  ],
  props: pick(Dialog.props, [
    'open',
    'title',
    'beforeClose',
    'loading',
    'disabled',
    'okLabel',
    'cancelLabel'
  ]),
  data () {
    return {
      localTitle: this.title
    }
  },
  computed: {
    listeners () {
      return pick(this.$listeners, ['ok', 'cancel', 'afteropen', 'afterclose'])
    },
    priority () {
      return this.config['confirmbox.priority']
    }
  }
}
</script>

<template>
<veui-dialog
  :ui="ui"
  :overlay-class="mergeOverlayClass({
    'veui-alert-box': true,
    [`veui-alert-box-${type}`]: true
  })"
  :open.sync="localOpen"
  :closable="false"
  :escapable="false"
  :priority="priority"
  :before-close="beforeClose"
  @ok="$emit('ok')"
  role="alertdialog">
  <veui-icon v-if="icons[type]"
    class="veui-alert-box-icon"
    :name="icons[type]">
  </veui-icon>
  <h3 class="veui-alert-box-title">
    <template v-if="title">{{ title }}</template>
    <slot name="title" v-else>title</slot>
  </h3>
  <div class="veui-alert-box-content">
    <slot/>
  </div>
  <template slot="foot" slot-scope="{ close }">
    <veui-button autofocus @click="close('ok')">知道了</veui-button>
  </template>
</veui-dialog>
</template>

<script>
import { pick, includes } from 'lodash'
import Dialog from './Dialog'
import Button from './Button'
import Icon from './Icon'
import config from '../managers/config'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'

config.defaults({
  'alertbox.priority': 100
})

export default {
  name: 'veui-alert-box',
  mixins: [ui, overlay],
  props: {
    ...pick(Dialog.props, ['open', 'title', 'beforeClose']),
    type: {
      type: String,
      validator (val) {
        return includes(['success', 'error', 'info', 'warning'], val)
      },
      default: 'success'
    }
  },
  components: {
    'veui-dialog': Dialog,
    'veui-button': Button,
    'veui-icon': Icon
  },
  data () {
    return {
      localOpen: this.open,
      priority: config.get('alertbox.priority')
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

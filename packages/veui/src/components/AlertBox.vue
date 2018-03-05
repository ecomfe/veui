<template>
<veui-dialog :overlay-class="mergeOverlayClass('veui-alert-box')"
  :open.sync="localOpen"
  :ui="localUi"
  :closable="false"
  :priority="priority"
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
    <slot>content</slot>
  </div>
  <template slot="foot">
    <veui-button autofocus @click="$emit('ok')">知道了</veui-button>
  </template>
</veui-dialog>
</template>

<script>
import { pick, find, includes } from 'lodash'
import Dialog from './Dialog'
import Button from './Button'
import Icon from './Icon'
import config from '../managers/config'
import icons from '../mixins/icons'
import overlay from '../mixins/overlay'

config.defaults({
  'alertbox.priority': 100
})

export default {
  name: 'veui-alert-box',
  mixins: [icons, overlay],
  props: pick(Dialog.props, ['open', 'title', 'ui']),
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
  computed: {
    uis () {
      return [...(this.ui || '').split(/\s+/), 'reverse']
    },
    localUi () {
      return this.uis.join(' ')
    },
    type () {
      return find(this.uis, ui => includes(['success', 'error', 'info'], ui))
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

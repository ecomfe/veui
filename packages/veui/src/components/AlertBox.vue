<template>
<veui-dialog overlay-class="veui-alert-box"
  :open.sync="localOpen"
  :ui="localUi"
  :closable="false"
  :priority="priority">

  <veui-icon v-if="!!typeIconName"
    class="veui-alert-box-icon"
    :name="typeIconName">
  </veui-icon>

  <h3 class="veui-alert-box-title">
    <template v-if="!!title">{{ title }}</template>
    <slot name="title" v-else>title</slot>
  </h3>
  <div class="veui-alert-box-content">
    <slot>content</slot>
  </div>

  <template slot="foot">
    <veui-button @click="ok()">知道了</veui-button>
  </template>
</veui-dialog>
</template>

<script>
import { pick, find, includes } from 'lodash'
import Dialog from './Dialog'
import Button from './Button'
import Icon from './Icon'
import '../icons'
import config from '../managers/config'

config.defaults({
  'alertbox.priority': 100
})

export default {
  name: 'veui-alert-box',
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
    },
    typeIconName () {
      return {
        success: 'check-circle',
        info: 'info-circle',
        error: 'cross-circle'
      }[this.type]
    }
  },
  watch: {
    open (v) {
      this.localOpen = v
    },
    localOpen (v) {
      this.$emit('update:open', v)
    }
  },
  methods: {
    ok () {
      this.$emit('ok')
    }
  }
}
</script>

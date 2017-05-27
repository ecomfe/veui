<template>
  <veui-dialog :open.sync="localOpen"
    :title="title"
    ui="reverse"
    overlay-class="veui-confirm-box"
    @ok="ok()"
    @cancel="cancel()">
    <template slot="title">
      <slot name="title">confirm title</slot>
    </template>
    <slot></slot>
  </veui-dialog>
</template>

<script>
import { pick } from 'lodash'
import Dialog from './Dialog'

export default {
  name: 'veui-confirm-box',
  components: {
    'veui-dialog': Dialog
  },
  props: pick(Dialog.props, ['open', 'title']),
  data () {
    return {
      localOpen: this.open,
      localTitle: this.title
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
      this.localOpen = false
      this.$emit('ok')
    },
    cancel () {
      this.localOpen = false
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-confirm-box .veui-dialog-content-foot {
  padding: 30px 20px;
}
</style>

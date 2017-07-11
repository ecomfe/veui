<template>
  <div class="veui-tab" v-show="isActive">
    <slot v-if="isInited || isActive"></slot>
  </div>
</template>

<script>
import { pick } from 'lodash'
import { getTypedAncestorTracker } from '../../utils/helper'

export default {
  name: 'veui-tab',
  mixins: [getTypedAncestorTracker('tabs')],
  props: {
    label: {
      type: String,
      required: true
    },
    name: String,
    disabled: Boolean,
    to: {
      type: String,
      default: ''
    },
    native: Boolean
  },
  data () {
    return {
      index: null,
      isInited: false
    }
  },
  computed: {
    isActive () {
      return this.name
        ? this.tabs.localActive === this.name
        : this.tabs.localIndex === this.index
    }
  },
  watch: {
    isActive (val) {
      this.isInited = true
    }
  },
  created () {
    // TODO: 如果要支持可删除tab，需要修改实现
    this.index = this.tabs.tabs.length
    this.tabs.add({
      ...pick(this, 'label', 'disabled', 'to', 'native'),
      name: this.name || this.to
    })
  }
}
</script>

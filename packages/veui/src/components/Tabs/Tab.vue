<template>
  <div class="veui-tab" v-show="isActive">
    <slot v-if="isInited || isActive"></slot>
  </div>
</template>

<script>
import { pick, includes } from 'lodash'
import { getTypedAncestorTracker } from '../../utils/helper'
import { getNodes } from '../../utils/context'

export default {
  name: 'veui-tab',
  uiTypes: ['tab'],
  mixins: [getTypedAncestorTracker('tabs')],
  props: {
    label: {
      type: String,
      required: true
    },
    name: String,
    disabled: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: ''
    },
    native: Boolean,
    deletable: {
      type: Boolean,
      default: false
    }
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
  methods: {
    register (patch) {
      if (!patch) {
        this.index = this.tabs.items.length
        this.tabs.add({
          ...pick(this, 'label', 'disabled', 'to', 'native', 'deletable'),
          name: this.name || this.to
        })
      } else {
        let parent = getNodes(this.$parent)[0]
        let vdom = getNodes(this)[0]
        let oldIndex = this.index
        this.index = Array.prototype.filter.call(
          parent.children,
          ele => includes(ele.className.split(' '), 'veui-tab')
        ).indexOf(vdom)
        this.tabs.patchIndex(oldIndex, this.index)
      }
    }
  },
  created () {
    // for ssr
    this.register()
  },
  mounted () {
    this.register(true)
  },
  destroyed () {
    this.tabs.remove(this.index)
  }
}
</script>

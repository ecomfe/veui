<template>
<veui-dialog v-bind="attrs" :open.sync="realOpen" v-on="$listeners">
  <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
    <slot :name="slot" v-bind="scope"/>
  </template>
</veui-dialog>
</template>

<script>
import Vue from 'vue'
import Dialog from './Dialog'
import prefix, { prefixify } from '../mixins/prefix'
import useControllable from '../mixins/controllable'
import '../common/global'
import { LOOSE_PROP_DEF, normalizeClass, normalizeStyle } from '../utils/helper'

const PLACEMENT = ['top', 'right', 'bottom', 'left']

const state = Vue.observable({
  top: [],
  right: [],
  bottom: [],
  left: []
})

export default {
  name: 'veui-drawer',
  components: {
    'veui-dialog': Dialog
  },
  mixins: [prefix, useControllable(['open'])],
  inheritAttrs: false,
  props: {
    open: Boolean,
    placement: {
      type: String,
      default: 'right',
      validator (value) {
        return PLACEMENT.indexOf(value) >= 0
      }
    },
    overlayClass: LOOSE_PROP_DEF,
    overlayStyle: LOOSE_PROP_DEF
  },
  data () {
    return {
      level: 0
    }
  },
  computed: {
    attrs () {
      return {
        // attrs 都直接透传到 Dialog 去
        ...this.$attrs,
        overlayClass: normalizeClass(
          this.$c(`drawer-${this.placement}`),
          this.$c('drawer-box'),
          this.overlayClass
        ),
        overlayStyle: normalizeStyle(
          { [`--${prefixify('drawer-indent-level')}`]: this.indentLevel },
          this.overlayStyle
        ),
        draggable: false
      }
    },
    indentLevel () {
      let stack = state[this.placement]
      let index = stack.indexOf(this)

      if (index === -1) {
        return 0
      }

      return stack.length - index - 1
    }
  },
  watch: {
    realOpen (val) {
      this.updateStack(this.placement, val)
    },
    placement (val, oldVal) {
      if (!this.realOpen) {
        return
      }

      if (oldVal) {
        this.updateStack(oldVal, false)
      }

      this.updateStack(val, true)
    }
  },
  mounted () {
    if (this.realOpen) {
      this.updateStack(this.placement, true)
    }
  },
  destroyed () {
    this.updateStack(this.placement, false)
  },
  methods: {
    updateStack (side, val) {
      let stack = state[side]
      if (val) {
        stack.push(this)
      } else {
        stack.splice(stack.indexOf(this), 1)
      }
    }
  }
}
</script>

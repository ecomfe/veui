<template>
<veui-dialog
  ref="root"
  v-bind="attrs"
  :open.sync="realOpen"
  v-on="$listeners"
>
  <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
    <slot :name="slot" v-bind="scope"/>
  </template>
</veui-dialog>
</template>

<script>
import Vue from 'vue'
import Dialog from './Dialog'
import ui, { prefixify } from '../mixins/ui'
import useControllable from '../mixins/controllable'
import '../common/global'
import { LOOSE_PROP_DEF, normalizeClass, normalizeStyle } from '../utils/helper'

const PLACEMENT = ['top', 'right', 'bottom', 'left']
const DIMENSION_MAP = {
  top: 'offsetHeight',
  right: 'offsetWidth',
  bottom: 'offsetHeight',
  left: 'offsetWidth'
}

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
  mixins: [ui, useControllable(['open'])],
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
      dimension: null
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
          { [`--${prefixify('drawer-indent-level')}`]: this.indent.level },
          {
            [`--${prefixify(
              'drawer-indent-offset'
            )}`]: `${this.indent.offset}px`
          },
          this.overlayStyle
        ),
        draggable: false
      }
    },
    indent () {
      let stack = state[this.placement]
      let top = stack[stack.length - 1]
      let index = stack.indexOf(this)

      if (index === -1 || stack.length === 0 || this === top) {
        return {
          level: 0,
          offset: 0
        }
      }

      return {
        level: stack.length - index - 1,
        offset: top.dimension - this.dimension
      }
    }
  },
  watch: {
    realOpen (val) {
      this.$nextTick(() => {
        this.updateStack(this.placement, val)
      })
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
        this.dimension = this.$refs.root.$refs.content[DIMENSION_MAP[side]]
        stack.push(this)
      } else {
        let index = stack.indexOf(this)
        if (index !== -1) {
          stack.splice(index, 1)
        }
      }
    }
  }
}
</script>

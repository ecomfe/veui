<script>
import Vue from 'vue'
import Dialog from './Dialog'
import prefix, { prefixify } from '../mixins/prefix'
import useControllable from '../mixins/controllable'
import '../common/global'
import { LOOSE_PROP_DEF, normalizeClass, normalizeStyle } from '../utils/helper'
import { omit } from 'lodash'

const PLACEMENT = ['top', 'right', 'bottom', 'left']

const state = Vue.observable({
  top: [],
  right: [],
  bottom: [],
  left: []
})

export default {
  name: 'veui-drawer',
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
    indentLevel () {
      let stack = state[this.placement]
      return stack.length - stack.indexOf(this) - 1
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
  methods: {
    updateStack (side, val) {
      let stack = state[side]
      if (val) {
        stack.push(this)
      } else {
        stack.splice(stack.indexOf(this), 1)
      }
    }
  },
  render (h) {
    let data = {
      attrs: {
        // attrs 都直接透传到 Dialog 去
        ...omit(this.$attrs, ['open', 'placement', 'overlayClass']),
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
      },
      props: {
        open: this.realOpen
      },
      // nativeOn 直接在 drawer 上注册到 dom ，不需透传
      on: this.$listeners,
      scopedSlots: this.$scopedSlots
    }

    return h(
      Dialog,
      data,
      Object.keys(this.$slots).map((slot) =>
        h('template', { slot }, this.$slots[slot])
      )
    )
  }
}
</script>

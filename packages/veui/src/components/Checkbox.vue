<template>
<label
  :class="{
    'veui-checkbox': true,
    'veui-disabled': realReadonly || realDisabled
  }"
  :ui="ui">
  <input
    ref="box"
    type="checkbox"
    v-bind="attrs"
    @change="handleChange"
    v-on="listeners">
  <span class="veui-checkbox-box">
    <transition name="veui-checkbox-icon">
      <veui-icon v-if="localIndeterminate" :name="icons.indeterminate"/>
    </transition>
    <transition name="veui-checkbox-icon">
      <veui-icon v-if="localChecked && !localIndeterminate" :name="icons.checked"/>
    </transition>
  </span>
  <span class="veui-checkbox-label"><slot/></span>
</label>
</template>

<script>
import Icon from './Icon'
import input from '../mixins/input'
import ui from '../mixins/ui'
import { getListeners } from '../utils/helper'
import { patchIndeterminate, focus } from '../utils/dom'

const EVENTS = ['click', 'keyup', 'keydown', 'keypress', 'focus', 'blur']

export default {
  name: 'veui-checkbox',
  inheritAttrs: false,
  components: {
    'veui-icon': Icon
  },
  mixins: [ui, input],
  model: {
    prop: 'model',
    event: 'change'
  },
  props: {
    trueValue: {
      type: null,
      default: true
    },
    falseValue: {
      type: null,
      default: false
    },
    checked: Boolean,
    indeterminate: Boolean,
    model: null
  },
  data () {
    return {
      localChecked: this.checked,
      localIndeterminate: this.indeterminate
    }
  },
  computed: {
    attrs () {
      return {
        name: this.realName,
        disabled: this.realDisabled || this.realReadonly,
        checked: this.localChecked,
        ...this.$attrs
      }
    },
    listeners () {
      return getListeners(EVENTS, this)
    }
  },
  watch: {
    checked (val) {
      this.localChecked = val
    },
    localChecked  (val) {
      if (this.checked !== val) {
        this.$emit('update:checked', val)
      }

      this.$emit('change', val ? this.trueValue : this.falseValue)
    },
    model: {
      handler (val) {
        if (typeof val === 'undefined') {
          return
        }
        this.localChecked = val === this.trueValue
      },
      immediate: true
    },
    indeterminate (val) {
      this.localIndeterminate = val
    },
    localIndeterminate (val) {
      this.$refs.box.indeterminate = val
      if (this.indeterminate !== val) {
        this.$emit('update:indeterminate', false)
      }
    }
  },
  methods: {
    activate () {
      this.toggleChecked()
    },
    handleChange () {
      if (this.localIndeterminate) {
        this.localChecked = this.falseValue
        this.localIndeterminate = false
      } else {
        this.toggleChecked()
      }
    },
    toggleChecked () {
      this.localChecked = !this.localChecked
    },
    focus ({ visible = false }) {
      if (visible) {
        focus(this.$refs.box)
      } else {
        this.$refs.box.focus()
      }
    }
  },
  mounted () {
    let box = this.$refs.box
    box.indeterminate = this.localIndeterminate
    patchIndeterminate(box)
  }
}
</script>

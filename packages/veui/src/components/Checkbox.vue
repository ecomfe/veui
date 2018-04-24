<template>
<label :class="{
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
      <veui-icon v-if="localChecked && localIndeterminate" :name="icons.indeterminate"/>
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
import { patchIndeterminate } from '../utils/dom'

const EVENTS = ['keyup', 'keydown', 'keypress', 'focus', 'blur']

export default {
  name: 'veui-checkbox',
  inheritAttrs: false,
  components: {
    'veui-icon': Icon
  },
  mixins: [ui, input],
  model: {
    prop: 'checked',
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
    checked: {
      type: null,
      default: false
    },
    indeterminate: Boolean
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
        checked: this.isChecked,
        ...this.$attrs
      }
    },
    isChecked () {
      return this.localChecked === this.trueValue
    },
    listeners () {
      return getListeners(EVENTS, this)
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
      this.localChecked = this.isChecked ? this.falseValue : this.trueValue
    }
  },
  watch: {
    indeterminate (val) {
      this.localIndeterminate = val
    },
    checked (val) {
      this.localChecked = val
    },
    localIndeterminate (val) {
      this.$refs.box.indeterminate = val
      if (this.indeterminate !== val) {
        this.$emit('update:indeterminate', false)
      }
    },
    localChecked (val) {
      if (this.checked !== val) {
        this.$emit('change', val)
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

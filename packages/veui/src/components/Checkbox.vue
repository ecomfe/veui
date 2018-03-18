<template>
<label :class="{
    'veui-checkbox': true,
    'veui-disabled': realReadonly || realDisabled
  }"
  :ui="ui">
  <input ref="box" type="checkbox" v-bind="attrs" @change="handleChange">
  <span class="veui-checkbox-box">
    <veui-icon v-if="isChecked || localIndeterminate" :name="icons[localIndeterminate ? 'indeterminate' : 'checked']"/>
  </span>
  <span class="veui-checkbox-label"><slot/></span>
</label>
</template>

<script>
import Icon from './Icon'
import input from '../mixins/input'
import ui from '../mixins/ui'
import { patchIndeterminate } from '../utils/dom'

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
    indeterminate (value) {
      this.localIndeterminate = value
    },
    checked (value) {
      this.localChecked = value
    },
    localIndeterminate (value) {
      this.$refs.box.indeterminate = value
      if (this.indeterminate !== value) {
        this.$emit('update:indeterminate', false)
      }
    },
    localChecked (value) {
      if (this.checked !== value) {
        this.$emit('change', value)
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

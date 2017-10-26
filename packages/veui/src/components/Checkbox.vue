<template>
<label :class="{
    'veui-checkbox': true,
    'veui-disabled': realReadonly || realDisabled
  }" :ui="ui">
  <input ref="box" type="checkbox" v-bind="attrs" :checked="localChecked" @click="handleClick">
  <span class="veui-checkbox-box">
    <icon v-if="localChecked || localIndeterminate" :name="icons[localIndeterminate ? 'indeterminate' : 'checked']"></icon>
  </span>
  <span class="veui-checkbox-label"><slot></slot></span>
</label>
</template>

<script>
import Icon from './Icon'
import { input, icons } from '../mixins'
import { pick } from 'lodash'
import { patchIndeterminate } from '../utils/dom'

export default {
  name: 'veui-checkbox',
  components: {
    Icon
  },
  mixins: [input, icons],
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    ui: String,
    trueValue: {
      type: null,
      default: true
    },
    falseValue: {
      type: null,
      default: false
    },
    checked: null,
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
      let attrs = pick(this.$props, 'checked')
      attrs.name = this.realName
      attrs.disabled = this.realDisabled || this.realReadonly
      return attrs
    }
  },
  methods: {
    activate () {
      this.localChecked = !this.localChecked
    },
    handleClick () {
      this.localChecked = this.localIndeterminate ? false : !this.localChecked
      this.localIndeterminate = false
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
      this.localIndeterminate = false
      if (this.checked !== value) {
        this.$emit('change', value ? this.trueValue : this.falseValue)
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

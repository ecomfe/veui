<template>
<label :class="{
    'veui-switch': true,
    'veui-switch-on': localChecked === trueValue,
    'veui-switch-disabled': realDisabled || realReadonly
  }" :ui="ui">
  <div class="veui-switch-switcher">
    <input type="checkbox" v-bind="attrs" :disabled="realDisabled || realReadonly" @change="handleChange($event.target.checked)">
    <span class="veui-switch-button"></span>
  </div>
  <div class="veui-switch-label"><slot></slot></div>
</label>
</template>

<script>
import Icon from './Icon'
import input from '../mixins/input'
import { pick } from 'lodash'

export default {
  name: 'veui-switch',
  components: {
    'veui-icon': Icon
  },
  mixins: [input],
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
    checked: null
  },
  data () {
    return {
      localChecked: this.checked
    }
  },
  computed: {
    attrs () {
      return {
        ...pick(this.$props, 'name', 'readonly', 'indeterminate'),
        checked: this.localChecked
      }
    }
  },
  watch: {
    checked (val) {
      this.localChecked = val
    }
  },
  methods: {
    handleChange (checked) {
      this.localChecked = checked ? this.trueValue : this.falseValue
      this.$emit('change', this.localChecked)
    }
  }
}
</script>

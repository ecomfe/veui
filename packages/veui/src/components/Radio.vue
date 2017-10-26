<template>
<label :class="{
    'veui-radio': true,
    'veui-disabled': realReadonly || realDisabled
  }" :ui="ui">
  <input type="radio" v-bind="attrs" v-model="localChecked">
  <span class="veui-radio-box"></span>
  <span class="veui-radio-label"><slot></slot></span>
</label>
</template>

<script>
import { input } from '../mixins'
import { pick } from 'lodash'

export default {
  name: 'veui-radio',
  mixins: [input],
  props: {
    ui: String,
    value: null,
    checked: Boolean
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
  data () {
    return {
      localChecked: this.checked
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
  watch: {
    checked (value) {
      this.localChecked = value
    },
    localChecked (value) {
      if (this.checked !== value) {
        this.$emit('change', value)
      }
    }
  }
}
</script>

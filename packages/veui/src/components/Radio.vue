<template>
<label class="veui-radio" :ui="ui">
  <input type="radio" v-bind="attrs" @change="$emit('change', $event.target.checked)">
  <span class="veui-radio-box"></span>
  <span><slot></slot></span>
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
  computed: {
    attrs () {
      let attrs = pick(this.$props, 'checked')
      attrs.name = this.realName
      attrs.disabled = this.realDisabled || this.realReadonly
      return attrs
    }
  }
}
</script>

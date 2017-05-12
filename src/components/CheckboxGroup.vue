<template>
  <div class="veui-checkboxgroup">
    <checkbox
      :ui="ui"
      :name="localName"
      v-for="(item, index) in items"
      :key="index"
      :value="item.value"
      :disabled="item.disabled"
      :checked="value.indexOf(item.value) !== -1"
      @change="checked => handleChange(item.value, checked)">
      <slot v-bind="item">{{ item.label }}</slot>
    </checkbox>
  </div>
</template>

<script>
import { input } from '../mixins'
import Checkbox from './Checkbox'
import { uniqueId, findIndex } from 'lodash'

export default {
  name: 'veui-boxgroup',
  components: {
    'checkbox': Checkbox
  },
  mixins: [input],
  model: {
    event: 'change'
  },
  props: {
    ui: String,
    items: Array,
    value: Array
  },
  computed: {
    localName () {
      return this.name || uniqueId('veui-checkboxgroup-')
    }
  },
  methods: {
    handleChange (value, checked) {
      if (checked) {
        this.value.push(value)
      } else {
        this.value.splice(findIndex(this.value, item => item === value), 1)
      }
      this.$emit('change', this.value)
    }
  }
}
</script>


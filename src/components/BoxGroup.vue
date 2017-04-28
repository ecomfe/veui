<template>
  <div>
    <component :is="type"
    :ui="ui"
    :name="localName"
    v-for="(item, index) in items"
    :key="index"
    :value="item.value"
    :disabled="item.disabled"
    :checked="type === 'radiobox' ? item.value === value : value.includes(item.value)"
    @change="boxChange(index, arguments[0])">
      <slot :label="item.label" :value="item.value">{{ item.label }}</slot>
    </component>
  </div>
</template>

<script>
import mixin from '../mixins/input'
import Radiobox from './Radiobox'
import Checkbox from './Checkbox'
import { uniqueId } from 'lodash'

export default {
  name: 'veui-boxgroup',
  components: {
    'radiobox': Radiobox,
    'checkbox': Checkbox
  },
  mixins: [ mixin ],
  props: {
    type: String,
    ui: String,
    name: String,
    items: Array,
    value: [ String, Array ]
  },
  computed: {
    localName () {
      return this.name || uniqueId('veui-boxgroup-')
    }
  },
  methods: {
    boxChange (index, checked) {
      if (this.type === 'radiobox') {
        this.$emit('input', this.items[index].value)
      } else {
        let value = this.items[index].value
        if (checked) {
          this.value.push(value)
        } else {
          this.value.splice(this.value.findIndex(item => item === value), 1)
        }
        this.$emit('input', this.value)
      }
    }
  }
}
</script>


<template>
  <div>
    <component :is="type" :ui="ui" :name="name" v-for="(item, index) in items" :key="index" v-bind="{ value: item.value, disabled: item.disabled, checked: item.checked}" @change="boxChange(index, arguments[0])">
      <slot :label="item.label"></slot>
    </component>
  </div>
</template>

<script>
import mixin from '../mixins/input'
import Radiobox from './Radiobox'
import Checkbox from './Checkbox'

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
  mounted () {
    this.items.map(item => {
      item.checked = this.type === 'radiobox' ? item.value === this.value : this.value.indexOf(item.value) !== -1
    })
  },
  watch: {
    value (value) {
      this.items.map(item => {
        item.checked = this.type === 'radiobox' ? item.value === value : value.indexOf(item.value) !== -1
      })
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


<template>
  <div>
    <template v-if="type === 'radiobox'">
      <veui-radiobox type="radiobox" :ui="ui" :name="name" v-for="(item, index) in items" :key="index" v-bind="{ value: item.value, disabled: item.disabled, checked: item.checked, id: item.id }" @change="radioChange(index)">
        <slot :label="item.label"></slot>
      </veui-radiobox>
    </template>
    <template v-else-if="type === 'checkbox'">
      <veui-checkbox type="checkbox" :ui="ui" :name="name" v-for="(item, index) in items" :key="index" v-bind="{ value: item.value, disabled: item.disabled, checked: item.checked, indeterminate: item.indeterminate, id: item.id }" @change="checkboxChange(index, arguments[0])">
        <slot :label="item.label"></slot>
      </veui-checkbox>
    </template>
  </div>
</template>

<script>
import mixin from '../mixins/input'
import Radiobox from './Radiobox'
import Checkbox from './Checkbox'

export default {
  name: 'veui-boxgroup',
  components: {
    'veui-radiobox': Radiobox,
    'veui-checkbox': Checkbox
  },
  mixins: [ mixin ],
  props: {
    type: String,
    ui: String,
    name: String,
    items: Array
  },
  computed: {
    picked () {
      if (this.type === 'radiobox') {
        return this.items.find(item => item.checked).value
      } else if (this.type === 'checkbox') {
        return this.items.filter(item => item.checked).map(item => item.value)
      }
    }
  },
  mounted () {
    this.$emit('input', this.picked)
  },
  methods: {
    radioChange (index) {
      let items = this.items
      let value = items[index].value
      items.forEach((v, i) => {
        this.$set(v, 'checked', index === i)
      })
      this.$emit('input', value)
    },
    checkboxChange (index, checked) {
      let items = this.items
      let value = items[index].value
      let picked = this.picked
      items[index].checked = checked
      if (checked) {
        picked.push(value)
      } else {
        let i = picked.findIndex(item => item === value)
        picked.splice(i, 1)
      }
      this.$emit('input', picked)
    }
  }
}
</script>


<script>
import { omit } from 'lodash'
import OptionGroup from '../OptionGroup'

export default {
  name: 'veui-time-picker-option-group',
  uiTypes: ['select', 'input'],
  inheritAttrs: false,
  props: {
    value: Number
  },
  computed: {
    localValue () {
      if (!this.select) {
        return null
      }
      return this.select.localValue
    }
  },
  methods: {
    handleSelect (value) {
      this.$emit('change', value)
    }
  },
  render (h) {
    let data = {
      // 一定要 spread，否则响应式有问题
      attrs: {
        ...this.$attrs
      },
      on: omit(this.$listeners, 'change'),
      scopedSlots: this.$scopedSlots
    }
    return h(
      OptionGroup,
      data,
      Object.keys(this.$slots).map(slot =>
        h('template', { slot }, this.$slots[slot])
      )
    )
  }
}
</script>

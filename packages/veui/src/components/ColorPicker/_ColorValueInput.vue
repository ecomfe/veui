<template>
<veui-input
  type="text"
  :value="localValue"
  :readonly="readonly"
  @input="handleValueInput"
  @blur="handleValueBlur"
/>
</template>

<script>
import Input from '../Input'
import {nudge} from '../../directives'
import {identity} from 'lodash'

export default {
  name: 'color-value-input',
  components: {
    'veui-input': Input
  },
  directives: {
    nudge
  },
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    format: {
      type: Function,
      default: identity
    },
    parse: {
      type: Function,
      default: identity
    }
  },
  data () {
    return {
      localValue: null
    }
  },
  computed: {
    formattedValue () {
      return this.format(this.value)
    }
  },
  watch: {
    value: {
      handler (val) {
        this.localValue = this.format(val)
      },
      immediate: true
    }
  },
  methods: {
    handleValueInput (val) {
      this.localValue = val
      let realValue
      try {
        realValue = this.parse(val)
      } catch (err) {
        return
      }
      this.$emit('input', realValue)
    },
    handleValueBlur () {
      if (this.formattedValue !== this.localValue) {
        this.localValue = this.formattedValue
      }
    }
  }
}
</script>

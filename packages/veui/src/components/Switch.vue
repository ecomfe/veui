<template>
<label
  :class="{
    'veui-switch': true,
    'veui-switch-on': localChecked,
    'veui-readonly': realReadonly,
    'veui-disabled': realDisabled
  }"
  :ui="ui">
  <input
    type="checkbox"
    v-bind="attrs"
    :disabled="realDisabled || realReadonly"
    @change="handleChange($event.target.checked)">
  <div class="veui-switch-switcher">
    <div class="veui-switch-button"></div>
  </div>
  <template v-if="$slots.default">
    <div class="veui-switch-label"><slot/></div>
  </template>
</label>
</template>

<script>
import Icon from './Icon'
import ui from '../mixins/ui'
import input from '../mixins/input'
import { pick } from 'lodash'

export default {
  name: 'veui-switch',
  components: {
    'veui-icon': Icon
  },
  mixins: [ui, input],
  model: {
    prop: 'model'
  },
  props: {
    trueValue: {
      type: null,
      default: true
    },
    falseValue: {
      type: null,
      default: false
    },
    checked: Boolean,
    model: null
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
    },
    localChecked  (val) {
      if (this.checked !== val) {
        this.$emit('update:checked', val)
      }

      this.$emit('input', val ? this.trueValue : this.falseValue)
    },
    model: {
      handler (val) {
        if (typeof val === 'undefined') {
          return
        }
        this.localChecked = val === this.trueValue
      },
      immediate: true
    }
  },
  methods: {
    handleChange (checked) {
      this.localChecked = checked
      this.$emit('change', checked)
    },
    activate () {
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.localChecked = !this.localChecked
    }
  }
}
</script>

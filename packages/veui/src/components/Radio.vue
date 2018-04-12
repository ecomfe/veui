<template>
<label
  :class="{
    'veui-radio': true,
    'veui-disabled': realReadonly || realDisabled
  }"
  :ui="ui">
  <input type="radio" v-bind="attrs" @change="localChecked = $event.target.checked">
  <span class="veui-radio-box"></span>
  <span class="veui-radio-label"><slot/></span>
</label>
</template>

<script>
import ui from '../mixins/ui'
import input from '../mixins/input'

export default {
  name: 'veui-radio',
  inheritAttrs: false,
  mixins: [ui, input],
  model: {
    prop: 'model',
    event: 'change'
  },
  props: {
    value: {
      type: null,
      default: true
    },
    checked: Boolean,
    model: null
  },
  data () {
    return {
      localChecked: this.model === this.value ? true : this.checked
    }
  },
  computed: {
    attrs () {
      return {
        checked: this.localChecked,
        name: this.realName,
        disabled: this.realDisabled || this.realReadonly,
        ...this.$attrs
      }
    }
  },
  watch: {
    checked: {
      handler (val) {
        this.localChecked = val
      },
      immediate: true
    },
    localChecked: {
      handler (val) {
        if (this.checked !== val) {
          this.$emit('update:checked', val)
        }

        if (val) {
          this.$emit('change', this.value)
        }
      },
      immediate: true
    },
    model: {
      handler (val) {
        if (val != null) {
          this.localChecked = val === null ? false : this.value === val
        }
      },
      immediate: true
    }
  }
}
</script>

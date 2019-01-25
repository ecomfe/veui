<template>
<label
  :class="{
    'veui-radio': true,
    'veui-disabled': realReadonly || realDisabled
  }"
  :ui="realUi"
>
  <input
    ref="box"
    type="radio"
    v-bind="attrs"
    @change="handleChange"
    v-on="listeners"
  >
  <span class="veui-radio-box"/>
  <span
    v-if="$slots.default"
    class="veui-radio-label"
  >
    <slot/>
  </span>
</label>
</template>

<script>
import ui from '../mixins/ui'
import input from '../mixins/input'
import focusable from '../mixins/focusable'
import activatable from '../mixins/activatable'
import { getListeners } from '../utils/helper'

const EVENTS = ['click', 'keyup', 'keydown', 'keypress', 'focus', 'blur']

export default {
  name: 'veui-radio',
  mixins: [ui, input, focusable, activatable],
  inheritAttrs: false,
  model: {
    prop: 'model'
  },
  props: {
    /* eslint-disable vue/require-prop-types */
    value: {
      default: true
    },
    model: {},
    /* eslint-enable vue/require-prop-types */
    checked: Boolean
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
    },
    listeners () {
      return getListeners(EVENTS, this)
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
          this.$emit('input', this.value)
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
  },
  methods: {
    handleChange ($event) {
      this.localChecked = $event.target.checked
      this.$emit('change', this.localChecked)
    },
    focus () {
      this.$refs.box.focus()
    },
    activate () {
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.localChecked = true
      this.focus()
    }
  }
}
</script>

<template>
<label
  :class="{
    'veui-radio': true,
    'veui-disabled': realReadonly || realDisabled
  }"
  :ui="realUi"
  v-on="labelListeners"
>
  <input
    ref="box"
    type="radio"
    v-bind="attrs"
    :checked.prop="localChecked"
    @change="handleChange"
    v-on="boxListeners"
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
import { pick } from 'lodash'
import ui from '../mixins/ui'
import input from '../mixins/input'
import activatable from '../mixins/activatable'
import { MOUSE_EVENTS, FOCUS_EVENTS, KEYBOARD_EVENTS } from '../utils/dom'

export default {
  name: 'veui-radio',
  mixins: [ui, input, activatable],
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
        name: this.realName,
        disabled: this.realDisabled || this.realReadonly,
        ...this.$attrs
      }
    },
    boxListeners () {
      return pick(this.$listeners, [...KEYBOARD_EVENTS, ...FOCUS_EVENTS])
    },
    labelListeners () {
      return pick(this.$listeners, MOUSE_EVENTS)
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
      this.change($event.target.checked)
    },
    change (checked) {
      if (this.localChecked === checked) {
        return
      }
      this.localChecked = checked
      this.$nextTick(() => {
        this.$emit('change', this.localChecked)
      })
    },
    focus () {
      this.$refs.box.focus()
    },
    activate () {
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.change(true)
      this.focus()
    }
  }
}
</script>

<template>
<label
  :class="{
    'veui-switch': true,
    'veui-switch-on': localChecked,
    'veui-readonly': realReadonly,
    'veui-disabled': realDisabled
  }"
  :ui="realUi"
>
  <input
    ref="box"
    type="checkbox"
    v-bind="attrs"
    :disabled="realDisabled || realReadonly"
    @change="handleChange($event.target.checked)"
    v-on="listeners"
  >
  <div class="veui-switch-switcher">
    <div class="veui-switch-button"/>
  </div>
  <template v-if="$slots.default">
    <div class="veui-switch-label">
      <slot/>
    </div>
  </template>
</label>
</template>

<script>
import ui from '../mixins/ui'
import input from '../mixins/input'
import focusable from '../mixins/focusable'
import { pick } from 'lodash'
import { getListeners } from '../utils/helper'

const EVENTS = ['click', 'keyup', 'keydown', 'keypress', 'focus', 'blur']

export default {
  name: 'veui-switch',
  mixins: [ui, input, focusable],
  model: {
    prop: 'model'
  },
  props: {
    /* eslint-disable vue/require-prop-types */
    trueValue: {
      default: true
    },
    falseValue: {
      default: false
    },
    model: {},
    /* eslint-enable vue/require-prop-types */
    checked: Boolean
  },
  data () {
    return {
      localChecked: this.checked
    }
  },
  computed: {
    attrs () {
      return {
        ...pick(this.$props, 'name', 'readonly'),
        checked: this.localChecked
      }
    },
    listeners () {
      return getListeners(EVENTS, this)
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
    focus () {
      this.$refs.box.focus()
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

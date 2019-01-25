<template>
<label
  :class="{
    'veui-checkbox': true,
    'veui-disabled': realReadonly || realDisabled
  }"
  :ui="realUi"
>
  <input
    ref="box"
    type="checkbox"
    v-bind="attrs"
    @change="handleChange"
    v-on="listeners"
  >
  <span class="veui-checkbox-box">
    <transition name="veui-checkbox-icon">
      <veui-icon
        v-if="localIndeterminate"
        :name="icons.indeterminate"
      />
    </transition>
    <transition name="veui-checkbox-icon">
      <veui-icon
        v-if="localChecked && !localIndeterminate"
        :name="icons.checked"
      />
    </transition>
  </span>
  <span
    v-if="$slots.default"
    class="veui-checkbox-label"
  >
    <slot/>
  </span>
</label>
</template>

<script>
import Icon from './Icon'
import ui from '../mixins/ui'
import input from '../mixins/input'
import focusable from '../mixins/focusable'
import { getListeners } from '../utils/helper'
import { patchIndeterminate } from '../utils/dom'

const EVENTS = ['click', 'keyup', 'keydown', 'keypress', 'focus', 'blur']

export default {
  name: 'veui-checkbox',
  components: {
    'veui-icon': Icon
  },
  mixins: [ui, input, focusable],
  inheritAttrs: false,
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
    checked: Boolean,
    indeterminate: Boolean
  },
  data () {
    return {
      localChecked: this.checked,
      localIndeterminate: this.indeterminate
    }
  },
  computed: {
    attrs () {
      return {
        name: this.realName,
        disabled: this.realDisabled || this.realReadonly,
        checked: this.localChecked,
        ...this.$attrs
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
    },
    indeterminate (val) {
      this.localIndeterminate = val
    },
    localIndeterminate (val) {
      this.$refs.box.indeterminate = val
      if (this.indeterminate !== val) {
        this.$emit('update:indeterminate', false)
      }
    }
  },
  mounted () {
    let box = this.$refs.box
    box.indeterminate = this.localIndeterminate
    patchIndeterminate(box)
  },
  methods: {
    handleChange () {
      if (this.localIndeterminate) {
        this.localChecked = this.falseValue
        this.localIndeterminate = false
      } else {
        this.toggleChecked()
      }
      this.$emit('change', this.localChecked)
    },
    toggleChecked () {
      this.localChecked = !this.localChecked
    },
    focus () {
      this.$refs.box.focus()
    },
    activate () {
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.toggleChecked()
      this.focus()
    }
  }
}
</script>

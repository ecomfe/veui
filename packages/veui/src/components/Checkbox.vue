<template>
<label
  :class="{
    'veui-checkbox': true,
    'veui-disabled': realReadonly || realDisabled
  }"
  :ui="realUi"
  v-on="labelListeners"
>
  <input
    ref="box"
    type="checkbox"
    v-bind="attrs"
    :indeterminate.prop="indeterminate"
    :checked.prop="localChecked"
    @change="handleChange"
    v-on="boxListeners"
  >
  <span class="veui-checkbox-box">
    <transition name="veui-checkbox-icon">
      <veui-icon
        v-if="indeterminate"
        :name="icons.indeterminate"
      />
    </transition>
    <transition name="veui-checkbox-icon">
      <veui-icon
        v-if="localChecked && !indeterminate"
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
import { pick, includes, pull } from 'lodash'
import Icon from './Icon'
import ui from '../mixins/ui'
import input from '../mixins/input'
import focusable from '../mixins/focusable'
import {
  patchIndeterminate,
  MOUSE_EVENTS,
  FOCUS_EVENTS,
  KEYBOARD_EVENTS
} from '../utils/dom'

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
    value: {},
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
      localChecked: this.checked
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
    checked (val) {
      this.localChecked = val
    },
    localChecked (val) {
      if (this.checked !== val) {
        this.$emit('update:checked', val)
      }

      if (Array.isArray(this.model)) {
        let model = [...this.model]
        if (val) {
          if (!includes(model, this.value)) {
            model.push(this.value)
          }
        } else {
          pull(model, this.value)
        }
        this.$emit('input', model)
        return
      }

      this.$emit('input', val ? this.trueValue : this.falseValue)
    },
    model: {
      handler (val) {
        if (typeof val === 'undefined') {
          return
        }

        if (Array.isArray(val)) {
          this.localChecked = includes(val, this.value)
          return
        }

        this.localChecked = val === this.trueValue
      },
      immediate: true
    }
  },
  mounted () {
    let { box } = this.$refs
    patchIndeterminate(box)
  },
  methods: {
    handleChange (e) {
      e.target.indeterminate = this.indeterminate
      this.localChecked = !this.localChecked
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
      this.localChecked = !this.localChecked
      this.$nextTick(() => {
        this.$emit('change', this.localChecked)
      })
      this.focus()
    }
  }
}
</script>

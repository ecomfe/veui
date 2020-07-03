<template>
<label
  :class="{
    [$c('checkbox')]: true,
    [$c('disabled')]: realReadonly || realDisabled
  }"
  :ui="realUi"
  v-on="labelListeners"
>
  <input
    ref="box"
    type="checkbox"
    v-bind="attrs"
    :indeterminate.prop="indeterminate"
    :checked="realChecked"
    @change="handleChange"
    v-on="boxListeners"
  >
  <span :class="$c('checkbox-box')">
    <transition :name="$c('checkbox-icon')">
      <veui-icon
        v-if="indeterminate"
        :name="icons.indeterminate"
      />
    </transition>
    <transition :name="$c('checkbox-icon')">
      <veui-icon
        v-if="realChecked && !indeterminate"
        :name="icons.checked"
      />
    </transition>
  </span>
  <span
    v-if="$slots.default"
    :class="$c('checkbox-label')"
  >
    <slot/>
  </span>
</label>
</template>

<script>
import { pick, includes, pull } from 'lodash'
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import controllable from '../mixins/controllable'
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
  mixins: [
    prefix,
    ui,
    input,
    focusable,
    controllable({
      prop: 'checked',
      get () {
        if (this.isControlled('checked')) {
          return this.checked
        } else if (this.isControlled('model')) {
          return Array.isArray(this.model)
            ? includes(this.model, this.value)
            : this.model === this.trueValue
        }
        return !!this.localChecked
      }
    })
  ],
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
    // we do not support using checked and v-model at the same time
    checked: Boolean,
    indeterminate: Boolean
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
    model: {
      handler (val) {
        if (typeof val === 'undefined') {
          return
        }

        let checked = Array.isArray(val)
          ? includes(val, this.value)
          : val === this.trueValue

        this.setReal('checked', checked)
      },
      immediate: true
    }
  },
  mounted () {
    let { box } = this.$refs
    patchIndeterminate(box)
  },
  methods: {
    handleChange () {
      let { box } = this.$refs
      box.indeterminate = this.indeterminate
      // 先把原生的值还原，最终由 realChecked 来控制原生的值
      box.checked = !box.checked

      let val = !this.realChecked

      this.setReal('checked', val)

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
      } else {
        this.$emit('input', val ? this.trueValue : this.falseValue)
      }

      this.$emit('change', val)
    },
    focus () {
      this.$refs.box.focus()
    },
    activate () {
      if (this.realDisabled || this.realReadonly) {
        return
      }

      this.handleChange() // activate will only be called upon user interaction
      this.focus()
    }
  }
}
</script>

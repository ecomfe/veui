<template>
<label
  :class="{
    'veui-switch': true,
    'veui-switch-on': localChecked,
    'veui-switch-loading': loading,
    'veui-readonly': realReadonly,
    'veui-disabled': realDisabled
  }"
  :ui="realUi"
  v-on="labelListeners"
>
  <input
    ref="box"
    type="checkbox"
    v-bind="attrs"
    :checked.prop="localChecked"
    @change="handleChange"
    v-on="boxListeners"
  >
  <div class="veui-switch-switcher">
    <div class="veui-switch-button">
      <veui-icon
        v-if="loading"
        spin
        :name="icons.loading"
      />
    </div>
  </div>
  <template v-if="$slots.default">
    <div class="veui-switch-label">
      <slot/>
    </div>
  </template>
</label>
</template>

<script>
import Icon from './Icon'
import ui from '../mixins/ui'
import input from '../mixins/input'
import { pick } from 'lodash'
import { MOUSE_EVENTS, FOCUS_EVENTS, KEYBOARD_EVENTS } from '../utils/dom'

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
    loading: Boolean,
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
        name: this.realName,
        disabled: this.loading || this.realDisabled || this.realReadonly
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

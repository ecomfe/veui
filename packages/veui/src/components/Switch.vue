<template>
<label
  :class="{
    [$c('switch')]: true,
    [$c('switch-on')]: realChecked,
    [$c('switch-loading')]: loading,
    [$c('readonly')]: realReadonly,
    [$c('disabled')]: realDisabled
  }"
  :ui="realUi"
  v-on="labelListeners"
>
  <input
    ref="box"
    type="checkbox"
    v-bind="attrs"
    :checked.prop="realChecked"
    v-on="boxListeners"
    @change="handleChange"
    @click.stop
  >
  <div :class="$c('switch-switcher')">
    <div
      v-if="hasContent && !loading"
      :class="$c('switch-text')"
    >
      <slot
        name="content"
        :on="realChecked"
      >{{ contentLabel }}</slot>
    </div>
    <div :class="$c('switch-button')">
      <veui-icon
        v-if="loading"
        spin
        :name="icons.loading"
      />
    </div>
  </div>
  <template v-if="$slots.default">
    <div :class="$c('switch-label')">
      <slot/>
    </div>
  </template>
</label>
</template>

<script>
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import useControllable from '../mixins/controllable'
import { pick } from 'lodash'
import { MOUSE_EVENTS, FOCUS_EVENTS, KEYBOARD_EVENTS } from '../utils/dom'

export default {
  name: 'veui-switch',
  components: {
    'veui-icon': Icon
  },
  mixins: [
    prefix,
    ui,
    input,
    useControllable({
      prop: 'checked',
      get (val) {
        return this.isControlled('model') ? this.model === this.trueValue : val
      }
    })
  ],
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
    checked: Boolean,
    onLabel: String,
    offLabel: String
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
    },
    hasContent () {
      return this.onLabel || this.offLabel || this.$scopedSlots.content
    },
    contentLabel () {
      return this.realChecked ? this.onLabel : this.offLabel
    }
  },
  methods: {
    handleChange () {
      let checkbox = this.$refs.box
      // 先还原checked，如果 realChecked 真的变了会重新渲染的
      checkbox.checked = this.realChecked

      let val = !this.realChecked

      this.commit('checked', val)

      this.$emit('input', val ? this.trueValue : this.falseValue)
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

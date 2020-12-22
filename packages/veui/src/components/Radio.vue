<template>
<label
  :class="{
    [$c('radio')]: true,
    [$c('disabled')]: realReadonly || realDisabled
  }"
  :ui="realUi"
  v-on="labelListeners"
>
  <input
    ref="box"
    type="radio"
    v-bind="attrs"
    :checked="realChecked"
    v-on="boxListeners"
    @change="handleChange"
    @veui:sync="handleSync"
    @click.stop
  >
  <span :class="$c('radio-box')"/>
  <span
    v-if="$slots.default"
    :class="$c('radio-label')"
  >
    <slot/>
  </span>
</label>
</template>

<script>
import { pick, each } from 'lodash'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import activatable from '../mixins/activatable'
import useControllable from '../mixins/controllable'
import {
  triggerCustom,
  MOUSE_EVENTS,
  FOCUS_EVENTS,
  KEYBOARD_EVENTS
} from '../utils/dom'

export default {
  name: 'veui-radio',
  mixins: [
    prefix,
    ui,
    input,
    activatable,
    useControllable({
      prop: 'checked',
      get (val) {
        return this.isControlled('model') ? this.model === this.value : val
      }
    })
  ],
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
  methods: {
    handleChange (e) {
      let radio = this.$refs.box
      radio.checked = false
      this.commit('checked', true)

      let form = radio.form
      let name = this.attrs.name
      if (name) {
        this.$nextTick(() => {
          let siblings = form
            ? form.querySelectorAll(`input[name="${name}"][type="radio"]`)
            : null
          each(siblings, radio => triggerCustom(radio, 'veui:sync'))
        })
      }

      this.$emit('input', this.value)
      this.$emit('change', true)
    },
    // 处理同个 form 下相同名称的 radio
    handleSync () {
      let radio = this.$refs.box
      if (radio && radio.checked !== this.realChecked) {
        radio.checked = this.realChecked
      }
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

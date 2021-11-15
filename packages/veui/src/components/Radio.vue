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
    @veui:uncheck="handleUncheck"
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
import { pick } from 'lodash'
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

// Track named radio boxes that are not associated with any form,
// those sharing the same name will be silently unchecked when
// one of them is checked.
// For those are under a `<form>` element we just retrieve their
// siblings with `radio.form.querySelectorAll`.
const orphans = new Map()

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
      return pick(this.listenersWithValidations, [
        ...KEYBOARD_EVENTS,
        ...FOCUS_EVENTS
      ])
    },
    labelListeners () {
      return pick(this.listenersWithValidations, MOUSE_EVENTS)
    },
    isOrphan () {
      return !!this.realName && !this.$refs.box.form
    }
  },
  watch: {
    realName (val, oldVal) {
      this.leaveOhpans(oldVal)
      this.joinOphans(val)
    },
    realChecked (val) {
      if (val) {
        this.triggerSiblings('veui:uncheck')
      }
    }
  },
  mounted () {
    this.joinOphans()
  },
  beforeDestroy () {
    this.leaveOhpans()
  },
  methods: {
    joinOphans (name = this.realName) {
      if (!this.isOrphan) {
        return
      }

      let radio = this.$refs.box
      let siblings = orphans.get(name)
      if (!siblings) {
        siblings = new Set()
        orphans.set(name, siblings)
      }
      siblings.add(radio)
    },
    leaveOhpans (name = this.realName) {
      if (!this.isOrphan) {
        return
      }

      let radio = this.$refs.box
      let siblings = orphans.get(name)
      if (siblings) {
        siblings.delete(radio)
        if (siblings.size === 0) {
          orphans.delete(name)
        }
      }
    },
    handleChange () {
      let radio = this.$refs.box
      radio.checked = false
      this.commit('checked', true)

      let name = this.realName
      if (name) {
        this.$nextTick(() => {
          // If change is blocked, reset native checked state for grouped siblings,
          // otherwise update component state for the unchecked radio box.
          this.triggerSiblings(this.realChecked ? 'veui:uncheck' : 'veui:sync')
        })
      }

      this.$emit('input', this.value)
      this.$emit('change', true)
    },
    handleSync () {
      let radio = this.$refs.box
      if (radio && radio.checked !== this.realChecked) {
        radio.checked = this.realChecked
      }
    },
    handleUncheck () {
      if (this.realChecked !== false) {
        this.commit('checked', false)
      }
    },
    triggerSiblings (event) {
      if (!this.realName) {
        return
      }

      let name = this.realName
      let radio = this.$refs.box
      let form = radio.form
      let siblings = form
        ? form.querySelectorAll(`input[name="${name}"][type="radio"]`)
        : orphans.get(name)
      ;[...(siblings || [])].forEach(sibling => {
        if (radio !== sibling) {
          triggerCustom(sibling, event)
        }
      })
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

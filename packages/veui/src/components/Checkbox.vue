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

        this.realChecked = checked
        this.$forceUpdate()
      },
      immediate: true
    }
  },
  mounted () {
    let { box } = this.$refs
    patchIndeterminate(box)
    this.syncStateToNative()
  },
  updated () {
    // 关于 forceUpdate 和 updated/mounted 时的 sync：
    //  1. 仅仅对于组件控制原生 input 时才需要，因为用户可以操作原生 input 的状态
    //  2. 受控情况下，当用户修改了原生 checkbox 的 checked（记为 nativeChecked ），localChecked 会在 controllable 中变化（但是此时并不依赖 localChecked），
    //     emit 如果被上层受控拒绝了，那么此时 propChecked 并没有发生变化，此时整个 Checkbox 并不会 re-render,
    //     所以每次内部 set realChecked 时，都需要检查上层对这次修改的态度：
    //     即需要 forceUpdate 来将 propChecked 应用到原生的 checked 上去
    //  3. Vue 目前的 patch 实现并没有保证 nativeChecked 是绝对受控的（https://github.com/vuejs/vue/issues/10500），所以需要在每次更新时检查下
    this.syncStateToNative()
  },
  methods: {
    handleChange () {
      this.$refs.box.indeterminate = this.indeterminate

      let val = !this.realChecked

      this.realChecked = val
      this.$forceUpdate()

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
    },
    syncStateToNative () {
      let { box } = this.$refs
      if (box && this.realChecked !== box.checked) {
        box.checked = !!this.realChecked
      }
    }
  }
}
</script>

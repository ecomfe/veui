<template>
<veui-field :ui="ui" ref="field" class="veui-fieldset" :class="{'veui-fieldset-required': required}" v-bind="attrs">
  <template v-if="$slots.label" slot="label"><slot name="label"></slot></template>
  <slot></slot>
  <template v-if="$slots.tip" slot="tip"><slot name="tip"></slot></template>
</veui-field>
</template>

<script>
/**
 * fieldset 和 field 的区别是 fieldset 只能用来做 ui 上的排列和显示 tip，合并显示 error
 */
import Field from './Field'
import { get, pick, extend } from 'lodash'
export default {
  name: 'veui-fieldset',
  uiTypes: ['fieldset', 'form-container'],
  components: {
    'veui-field': Field
  },
  props: {
    ui: String,
    label: String,
    name: String,
    tip: String,
    disabled: Boolean,
    readonly: Boolean,
    // 因为会出现一行里边有必填和非必填共存，交给使用者决定显不显示星号
    required: false
  },
  computed: {
    attrs () {
      return extend(pick(this.$props, ['label', 'name', 'tip']), {
        disabled: this.realDisabled,
        readonly: this.realReadonly
      })
    },
    realDisabled () {
      return this.disabled || get(this, '$refs.field.form.disabled')
    },
    realReadonly () {
      return this.readonly || get(this, '$refs.field.form.readonly')
    }
  }
}
</script>

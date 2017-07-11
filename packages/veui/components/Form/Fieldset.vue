<template>
  <veui-field ref="field" class="veui-fieldset" v-bind="$props"><template v-if="$slots.label" slot="label"><slot name="label"></slot></template><slot></slot></veui-field>
</template>

<script>
/**
 * fieldset 和 field 的区别是 fieldset 只能用来做 ui 上的排列和显示 tip，合并显示 error
 */
import Field from './Field'
import { get } from 'lodash'
export default {
  name: 'veui-fieldset',
  uiTypes: ['fieldset', 'form-container'],
  components: {
    'veui-field': Field
  },
  props: {
    label: String,
    labelFor: String,
    name: String,
    tip: String,
    disabled: Boolean,
    readonly: Boolean
  },
  computed: {
    realDisabled () {
      return this.disabled || get(this, '$refs.field.form.disabled')
    },
    realReadonly () {
      return this.readonly || get(this, '$refs.field.form.readonly')
    }
  }
}
</script>

<template>
  <veui-field ref="field" class="veui-fieldset" :class="{'veui-fieldset-required': isRequired}" v-bind="attrs">
    <template v-if="$slots.label" slot="label"><slot name="label"></slot></template>
    <slot></slot>
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
  data () {
    return {
      isRequired: false
    }
  },
  props: {
    label: String,
    name: String,
    tip: String,
    disabled: Boolean,
    readonly: Boolean
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
  },
  created () {
    this.$on('updaterequired', (required) => { this.isRequired = required })
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-fieldset {
  clear: both;

  &-required > .veui-form-label::after {
    .veui-field-require();
  }

  &.veui-field-no-label::before,
  & > .veui-field-no-label::before {
    width: auto;
  }

  & > [class*="veui"]:not([class*="veui-form-label"]):not([class*="veui-span"]) {
    display: inline-block;
  }

  & > [class*="veui"]:not([class*="veui-form-label"]) {
    & + [class*="veui"],
    & + .veui-span {
      margin-left: 10px;
    }
  }

  &[ui~="alt"] {
    .veui-shadow();

    & > .veui-form-label,
    & > .veui-field:first-child .veui-form-label {
      padding-left: 10px;
    }

    & [class*="veui"][ui~="alt"] {
      border: none;
      box-shadow: none;
    }

    &,
    & > .veui-form-label,
    & > .veui-field > .veui-form-label {
      background-color: @veui-gray-color-sup-3;
      border-color: @veui-gray-color-sup-3;
      color: @veui-text-color-normal;
    }
  }

  &.veui-field-no-tip > .veui-field-no-tip:last-child .veui-field-error {
    position: static;
    display: inline-block;
    margin-left: 10px;
    height: 36px;
    line-height: 36px;
  }

  & .veui-form-tip + .veui-field-error,
  & .veui-field .veui-field-error,
  & > .veui-field-no-tip .veui-field-error {
    position: absolute;
    display: block;
    margin-left: 0;
    height: @veui-field-gap;
    line-height: @veui-field-gap;
  }

  & .veui-form-label ~ .veui-field-error {
    margin-left: @veui-form-label-width;
  }
}
</style>

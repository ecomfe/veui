<template>
  <veui-form-field ref="field" class="veui-form-field-set" v-bind="$props"><slot></slot></veui-form-field>
</template>

<script>
/**
 * fieldset 和 field 的区别是 fieldset 只能用来做 ui 上的排列和显示 tip，合并显示 error
 */
import Field from './Field'
import { getByName } from '../../utils/object'
export default {
  name: 'veui-form-field-set',
  uiTypes: ['form-field-set', 'form-container'],
  components: {
    'veui-form-field': Field
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
      return this.disabled || getByName('$refs.field.form.disabled', this)
    },
    realReadOnly () {
      return this.readonly || getByName('$refs.field.form.readonly', this)
    }
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-form-field-set {
  margin-bottom: @veui-form-field-gap;
  clear: both;

  &:last-of-type {
    margin-bottom: 0;
  }

  & > .veui-form-field {
    margin-bottom: 0;
  }

  &.veui-form-field-no-key::before,
  & > .veui-form-field-no-key::before {
    width: auto;
  }

  & > [class*="veui"]:not([class*="veui-form-key"]):not([class*="veui-span"]) {
    display: inline-block;
  }

  & > [class*="veui"]:not([class*="veui-form-key"]) {
    & + [class*="veui"],
    & + .veui-span {
      margin-left: 10px;
    }
  }

  &[ui~="alt"] {
    .veui-shadow();

    & > .veui-form-key,
    & > .veui-form-field:first-child .veui-form-key {
      padding-left: 10px;
    }

    & [class*="veui"][ui~="alt"] {
      border: none;
      box-shadow: none;
    }

    &,
    & > .veui-form-key,
    & > .veui-form-field > .veui-form-key {
      background-color: @veui-gray-color-sup-3;
      border-color: @veui-gray-color-sup-3;
      color: @veui-text-color-normal;
    }
  }

  &.veui-form-field-no-tip > .veui-form-field-no-tip:last-child .veui-form-field-error {
    position: static;
    display: inline-block;
    margin-left: 10px;
  }

  & .veui-form-tip + .veui-form-field-error,
  & .veui-form-field .veui-form-field-error,
  & > .veui-form-field-no-tip .veui-form-field-error {
    position: absolute;
    display: block;
    margin-left: 0;
    height: @veui-form-field-gap;
    line-height: @veui-form-field-gap;
  }

  & .veui-form-field:first-of-type .veui-form-key ~ .veui-form-field-error {
    margin-left: @veui-form-key-width;
  }
}
</style>

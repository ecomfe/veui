<template>
  <veui-field ref="field" class="veui-field-set" v-bind="$props"><slot></slot></veui-field>
</template>

<script>
/**
 * fieldset 和 field 的区别是 fieldset 只能用来做 ui 上的排列和显示 tip，合并显示 error
 */
import Field from './Field'
import { get } from 'lodash'
export default {
  name: 'veui-field-set',
  uiTypes: ['field-set', 'form-container'],
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

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-field-set {
  margin-bottom: @veui-field-gap;
  clear: both;

  &:last-of-type {
    margin-bottom: 0;
  }

  & > .veui-field {
    margin-bottom: 0;
  }

  &.veui-field-no-key::before,
  & > .veui-field-no-key::before {
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
    & > .veui-field:first-child .veui-form-key {
      padding-left: 10px;
    }

    & [class*="veui"][ui~="alt"] {
      border: none;
      box-shadow: none;
    }

    &,
    & > .veui-form-key,
    & > .veui-field > .veui-form-key {
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

  & .veui-field:first-of-type .veui-form-key ~ .veui-field-error {
    margin-left: @veui-form-key-width;
  }
}
</style>

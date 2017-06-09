<template>
  <label class="veui-radiobox" :ui="ui">
    <input type="radio" v-bind="attrs" @change="$emit('change', $event.target.checked)">
    <span class="veui-radiobox-box"></span>
    <span><slot></slot></span>
  </label>
</template>

<script>
import Icon from './Icon'
import '../icons'
import { input } from '../mixins'
import { assign, omit } from 'lodash'
import 'vue-awesome/icons/circle'

export default {
  name: 'veui-radiobox',
  components: {
    Icon
  },
  mixins: [input],
  props: {
    ui: String,
    value: null,
    checked: Boolean
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
  computed: {
    attrs () {
      return assign(omit(this.$props, 'ui'), { name: this.realName })
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-radiobox {
  display: inline-block;
  margin-right: 20px;
  color: #333;
  font-size: @veui-font-size-normal;
  line-height: 1;

  input,
  .veui-icon {
    display: none;
  }

  span {
    vertical-align: middle;
    cursor: pointer;
  }

  &-box {
    display: inline-block;
    position: relative;
    background-color: #fff;
    border-radius: 50%;
    height: @veui-font-size-large;
    width: @veui-font-size-large;
    margin-right: 7px;
    font-size: @veui-font-size-large;
    border: 1px solid @veui-gray-color-sup-1;
    box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  }

  &:hover &-box {
    border-color: @veui-theme-color-primary;
  }

  & :checked + &-box {
    border-color: @veui-theme-color-primary;
    .veui-shadow(none);

    &::before {
      content: "";
      display: block;
      .size(@veui-font-size-large);
      background-color: @veui-theme-color-primary;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.5);
    }
  }

  :disabled {
    &,
    & ~ span {
      cursor: not-allowed;
    }
    & ~ span {
      color: @veui-gray-color-weak;
    }
  }

  & :disabled + &-box {
    border-color: @veui-gray-color-sup-1;
    background-color: @veui-gray-color-sup-2;
    .veui-shadow(none);

    &::before {
      background-color: @veui-gray-color-weak;
    }
  }

  &[ui~="small"] {
    font-size: @veui-font-size-small;
    line-height: 1;
  }

  &[ui~="small"] &-box {
    margin-right: 6px;
    font-size: @veui-font-size-small;
    height: @veui-font-size-small;
    width: @veui-font-size-small;

    &::before {
      .size(@veui-font-size-small);
    }
  }

}
</style>

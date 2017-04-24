<template>
  <label class="veui-radiobox" :ui="ui">
    <input type="radio" v-bind="attrs" @change="$emit('change', $event.target.checked)">
    <span class="radiobox"><icon name="fa-circle"></icon></span>
    <span><slot></slot></span>
  </label>
</template>

<script>
import Icon from './Icon'
import mixin from '../mixins/input'
import 'vue-awesome/icons/fa-circle'

export default {
  name: 'veui-radiobox',
  components: {
    Icon
  },
  mixins: [mixin],
  props: {
    ui: String,
    name: String,
    value: String,
    disabled: Boolean,
    checked: Boolean
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
  computed: {
    attrs () {
      let attrs = Object.assign({}, this.$props)
      delete attrs.ui
      return attrs
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

  .radiobox {
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

  &:hover {
    .radiobox {
      border-color: @veui-theme-color-primary;
    }
  }

  :checked + .radiobox {
    border-color: @veui-theme-color-primary;
    .veui-shadow(none);
    .veui-icon {
      display: inline-block;
      color: @veui-theme-color-primary;
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
    & + .radiobox {
      border-color: @veui-gray-color-sup-1;
      background-color: @veui-gray-color-sup-2;
      .veui-shadow(none);
      .veui-icon {
        color: @veui-gray-color-weak;
      }
    }
  }

  &[ui~="small"] {
    font-size: @veui-font-size-small;
    line-height: 1;

    .radiobox {
      margin-right: 6px;
      font-size: @veui-font-size-small;
      height: @veui-font-size-small;
      width: @veui-font-size-small;
    }
  }

}
</style>

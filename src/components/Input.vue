<template>
  <input type="text"
    class="veui-input"
    v-bind="attrs"
    @focus="$emit('focus', $event)"
    @click="$emit('click', $event)"
    @change="$emit('change', $event)"
    @blur="$emit('blur', $event)"
    @input="$emit('input', $event.target.value)"
  >
</template>

<script>
import mixin from '@/mixins/input'
import omit from 'lodash/omit'
export default {
  name: 'veui-input',
  mixins: [mixin],
  props: {
    ui: String,
    placeholder: String,
    value: [String, Number]
  },
  computed: {
    attrs () {
      let omitItems = ['readonly', 'disabled'].filter(item => !this[item])
      let attrs = Object.assign({}, omit(this.$props, omitItems))
      return attrs
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-input {
  height: @veui-height-normal;
  width: 250px;
  padding: 0 11px;
  line-height: 1;
  vertical-align: middle;
  border: 1px solid @veui-theme-color-primary;
  border-radius: 2px;
  border-color: @veui-gray-color-sup-1;
  background-color: #fff;
  font-size: @veui-font-size-normal;

  &:hover {
    border-color: @veui-theme-color-primary;
  }

  &:focus {
    border-color: @veui-theme-color-primary;
    .veui-shadow(glow, @veui-theme-color-primary);
    outline: none;
  }

  &[readonly],
  &:disabled {
    background-color: @veui-gray-color-sup-3;
    border-color: @veui-gray-color-sup-1;
    color: @veui-text-color-weak;
    .veui-shadow(none);
  }

  &:disabled {
    cursor: not-allowed;
  }

  &[ui~="large"] {
    height: @veui-height-large;
    font-size: @veui-font-size-large;
  }

  &[ui~="small"] {
    height: @veui-height-small;
    font-size: @veui-font-size-small;
  }
}
</style>

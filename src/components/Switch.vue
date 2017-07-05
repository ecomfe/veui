<template>
<label :class="{
    'veui-switch': true,
    'veui-switch-on': localChecked === trueValue,
    'veui-switch-readonly': readonly,
    'veui-switch-disabled': disabled
  }" :ui="ui">
  <input type="checkbox" v-bind="attrs" :disabled="disabled || readonly" @change="handleChange($event.target.checked)">
  <span class="veui-switch-button">
    <veui-icon name="cross" v-if="disabled"></veui-icon>
    <veui-icon name="minus-thick" v-if="!disabled && readonly"></veui-icon>
  </span>
</label>
</template>

<script>
import Icon from './Icon'
import input from '../mixins/input'
import { pick } from 'lodash'

export default {
  name: 'veui-switch',
  components: {
    'veui-icon': Icon
  },
  mixins: [input],
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    ui: String,
    trueValue: {
      type: null,
      default: true
    },
    falseValue: {
      type: null,
      default: false
    },
    checked: null
  },
  data () {
    return {
      localChecked: this.checked
    }
  },
  computed: {
    attrs () {
      return {
        ...pick(this.$props, 'name', 'readonly', 'indeterminate'),
        checked: this.localChecked
      }
    }
  },
  watch: {
    checked (val) {
      this.localChecked = val
    }
  },
  methods: {
    handleChange (checked) {
      this.localChecked = checked ? this.trueValue : this.falseValue
      this.$emit('change', this.localChecked)
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-switch {
  @gap: 2px;

  .metrics(@size: @veui-height-small) {
    width: @size * 1.8;
    height: @size;
    border-radius: @size / 2;

    .veui-switch-button {
      .size(@size - @gap * 2);
      .veui-icon {
        .size(@size / 3 * 2);
      }
    }

    &.veui-switch-on .veui-switch-button {
      transform: translateX(@size * 0.8);
    }
  }

  .metrics();
  display: inline-block;
  background-color: @veui-gray-color-sup-1;
  color: @veui-gray-color-sup-1;
  cursor: pointer;
  user-select: none;
  transition: background-color ease .2s;

  &-button {
    display: inline-block;
    position: relative;
    margin: @gap;
    background-color: #fff;
    border-radius: 50%;
    transition: transform ease .2s;

    .veui-icon {
      .absolute(50%, _, _, 50%);
      transform: translate(-50%, -50%);
    }
  }

  &-on {
    background-color: @veui-theme-color-primary;
    color: @veui-theme-color-primary;
  }

  &-readonly {
    cursor: default;
  }

  &-disabled {
    background-color: @veui-gray-color-sup-1;
    color: @veui-gray-color-sup-1;
    cursor: not-allowed;
  }

  &-disabled &-button {
    background-color: @veui-gray-color-sup-3;
  }

  &[ui~="small"] {
    .metrics(@veui-height-tiny);
  }

  &[ui~="large"] {
    .metrics(@veui-height-normal);
  }

  input {
    display: none;
  }
}
</style>

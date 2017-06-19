<template>
  <label class="veui-checkbox" :ui="ui">
    <input ref="box" type="checkbox" v-bind="attrs" @change="handleChange($event.target.checked)">
    <span class="veui-checkbox-box">
      <icon v-if="checked || localIndeterminate" :name="localIndeterminate ? 'minus' : 'check'"></icon>
    </span>
    <span><slot></slot></span>
  </label>
</template>

<script>
import Icon from './Icon'
import '../icons'
import { input } from '../mixins'
import { assign } from 'lodash'
import { patchIndeterminate } from '../utils/dom'

export default {
  name: 'veui-checkbox',
  components: {
    Icon
  },
  mixins: [input],
  props: {
    ui: String,
    name: String,
    value: String,
    disabled: Boolean,
    checked: Boolean,
    indeterminate: Boolean
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
  data () {
    return {
      localIndeterminate: this.indeterminate
    }
  },
  computed: {
    attrs () {
      let attrs = assign({}, this.$props)
      delete attrs.ui
      delete attrs.indeterminate
      return attrs
    }
  },
  methods: {
    handleChange (checked) {
      this.localIndeterminate = false
      this.$emit('update:indeterminate', false)
      this.$emit('change', checked)
    }
  },
  watch: {
    indeterminate (value) {
      this.localIndeterminate = value
      this.$refs.box.indeterminate = value
    }
  },
  mounted () {
    let box = this.$refs.box
    box.indeterminate = this.localIndeterminate
    patchIndeterminate(box)
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-checkbox {
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
    border-radius: 3px;
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

  & :checked + &-box,
  & :indeterminate + &-box {
    background-color: @veui-theme-color-primary;
    border-color: @veui-theme-color-primary;
    .veui-icon {
      display: inline-block;
      position: absolute;
      color: #fff;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.75);
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

  & :disabled + &-box,
  & :indeterminate:disabled + &-box {
    border-color: @veui-gray-color-sup-1;
    background-color: @veui-gray-color-sup-2;
    .veui-icon {
      color: @veui-gray-color-weak;
    }
  }

  & :checked + &-box,
  & :disabled + &-box,
  & :indeterminate + &-box {
    .veui-shadow(none);
  }

  &[ui~="small"] {
    font-size: @veui-font-size-small;
    line-height: 1;
  }

  &[ui~="small"] &-box {
    margin-right: 6px;
    height: @veui-font-size-small;
    width: @veui-font-size-small;
    font-size: @veui-font-size-small;

    & + span {
      font-size: @veui-font-size-small;
    }
  }
}

</style>

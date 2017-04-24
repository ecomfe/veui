<template>
  <span class="veui-switch" v-bind="attrs">
    <label class="veui-switch-label animate-bg" :class="_state">
      <input class="veui-switch-cb" type="checkbox" name="cb" v-model="inputValue" @change="handleChange"  :disabled="disabled" :readonly="readonly">
      <span class="veui-switch-switch" :class="_state">
        <template v-if="disabled">
          <span class="veui-switch-disabled-icon">x</span>
        </template>
        <template v-if="readonly">
          <span class="veui-switch-icon" :class="_state"></span>
        </template>
      </span>
    </label>
  </span>
</template>

<script>
import mixin from '../mixins/input'

export default {
  name: 'veui-switch',
  mixins: [mixin],
  props: {
    ui: String,
    name: String,
    type: String,
    disabled: Boolean,
    readonly: Boolean,
    state: String, // 可切换状态
    value: Boolean // 不可切换
  },
  data () {
    return {
      inputValue: this.value
    }
  },
  computed: {
    attrs () {
      let attrs = Object.assign({}, this.$props)
      return attrs
    },
    _state () {
      let _state

      if (this.state) {
        _state = this.state
      } else {
        _state = (this.inputValue) ? 'on' : 'off'
      }
      return _state
    }
  },
  watch: {
    value (val) {
      this.inputValue = val
    }
  },
  methods: {
    handleChange (event) {
      if (this.readonly) {
        return
      }

      this.$emit('change', event.currentTarget.checked)
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-switch {
  display: inline-block;
  position: relative;
  font-size: @veui-font-size-normal;
  margin-right: 10px;

  @label-height: @veui-height-normal;
  .computeItems(@label-height) {
    .veui-switch-label {
      height: @label-height;
      min-width: @label-height * 1.8;
      line-height: @label-height;
      border-radius: @label-height * 2 / 3;

      &.on {
        .veui-switch-text {
          padding-left: @label-height / 2;
          padding-right: @label-height + 5;
        }
      }

      &.off {
        .veui-switch-text {
          padding-left: @label-height + 5;
          padding-right: @label-height / 2;
        }
      }
    }

    .veui-switch-switch {
      width: @label-height - 4;
      height: @label-height - 4;
      line-height: @label-height - 4;
      
      &.off {
        left: 0;
        margin-left: 2px;
      }
    }

    .veui-switch-icon {
      width: @label-height * 8 / 15;
      height: @label-height * 2 / 15;
      border-radius: @label-height * 0.2;
      vertical-align: middle;
    }

    .veui-switch-disabled-icon {
      font-size: @label-height * 2 / 3;
    }
  }

  &[ui~="small"] {
    @label-height: @veui-height-small;
    .computeItems(@label-height);
    font-size: @veui-font-size-small;
  }

  &[ui~="large"] {
    @label-height: @veui-height-large;
    .computeItems(@label-height);
    font-size: @veui-font-size-large;
  }

  .computeItems(@label-height);

  span {
    display: inline-block;
  }

  input[type="checkbox"] {
    display: none;
  }

  .veui-switch-label {
    display: inline-block;
    cursor: pointer;
    
    text-align: center;
    position: relative;
    text-align: left;
    user-select: none;
    overflow: hidden;

    background-color: @veui-theme-color-primary;
    .veui-shadow();

    &.off {
      background-color: @veui-gray-color-sup-1;
    }

    &.animate-bg {
      transition: background-color ease 0.8s;
    }
  }

  .veui-switch-text {
    font-weight: bold;
    color: #fff;
  }

  .veui-switch-switch {
      text-align: center;
      vertical-align: middle;
      position: absolute;
      top: 0px;
      
      /*border-radius:20px;*/
      border-radius: 100%;
      background-color: #fff;
      .veui-shadow();
      margin-top: 2px;

      &.on {
        right: 0;
        margin-right: 2px;
      }

      &.off {
        left: 0;
        margin-left: 2px;
      }
  }

  .veui-switch-error-message {
    color: red;
  }

  &[disabled='disabled'] {
    border: none;
    color: @veui-text-color-weak;
    .veui-shadow(none);

    .veui-switch-label {
      cursor: not-allowed;
    }

    .veui-switch-disabled-icon {
      font-weight: bold;
      position: relative;
      color: @veui-gray-color-sup-1;
    }
  }

  &[readonly="readonly"] {
    .veui-switch-label {
      cursor: not-allowed;
    }

    .veui-switch-icon {
      &.on {
        background-color: @veui-theme-color-primary;
      }

      &.off {
        left: 0;
        background-color: @veui-gray-color-sup-1;
      }
    }
  }

  &[ui~="plain"] {
    .veui-switch-text {
      font-weight: bold;
      color: @veui-gray-color-weak;
    }
    .veui-switch-label {
      background-color: @veui-gray-color-sup-2;

      &.on {
        background-color: @veui-gray-color-sup-2;
      }

      &.off {
        left: 0;
        background-color: @veui-gray-color-sup-1;
      }
    }

    .veui-switch-switch {
      background-color: @veui-gray-color-weak;

      &.on {
        background-color: @veui-gray-color-weak;
      }

      &.off {
        background-color: #fff;
      }
    }
  }
}
</style>

<template>
  <span class="veui-switch" v-bind="attrs">
    <label class="veui-switch-label" :class="localState">
      <input class="veui-switch-cb" type="checkbox" v-model="inputValue" @change="handleChange"  :disabled="disabled" :readonly="readonly">
      <span class="veui-switch-switch" :class="localState">
        <template v-if="disabled">
          <!-- <span class="veui-remove-icon">x</span> -->
        <icon name="remove"></icon>
        </template>
        <template v-if="readonly">
          <!-- <span class="veui-switch-icon" :class="localState"></span> -->
          <icon name="window-minimize"></icon>
        </template>
      </span>
    </label>
  </span>
</template>

<script>
import mixin from '../mixins/input'
import 'vue-awesome/icons/remove'
import 'vue-awesome/icons/window-minimize'

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
    localState () {
      let localState

      if (this.state) {
        localState = 'veui-switch-' + this.state
      } else {
        localState = (this.inputValue) ? 'veui-switch-on' : 'veui-switch-off'
      }
      return localState
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
  .computed_items(@label-height) {
    .veui-switch-label {
      height: @label-height;
      min-width: @label-height * 1.8;
      line-height: @label-height;
      border-radius: @label-height * 2 / 3;

      &.veui-switch-on {
        .veui-switch-text {
          padding-left: @label-height / 2;
          padding-right: @label-height + 5;
        }
      }

      &.veui-switch-off {
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

      &.veui-switch-off {
        left: 0;
        margin-left: 2px;
      }
    }

    // .veui-remove-icon {
    //   font-weight: bold;
    //   position: relative;
    //   color: @veui-gray-color-sup-1;
    // }

    .veui-switch-icon {
      width: @label-height * 8 / 15;
      height: @label-height * 2 / 15;
      border-radius: @label-height * 0.2;
      vertical-align: middle;
    }
  }

  &[ui~="small"] {
    @label-height: @veui-height-small;
    .computed_items(@label-height);
    font-size: @veui-font-size-small;
  }

  &[ui~="large"] {
    @label-height: @veui-height-large;
    .computed_items(@label-height);
    font-size: @veui-font-size-large;
  }

  .computed_items(@label-height);

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
    transition: background-color ease 0.8s;

    background-color: @veui-theme-color-primary;
    .veui-shadow();

    &.veui-switch-off {
      background-color: @veui-gray-color-sup-1;
    }
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

    &.veui-switch-on {
      right: 0;
      margin-right: 2px;
    }

    &.veui-switch-off {
      left: 0;
      margin-left: 2px;
    }
  }

  .veui-switch-error-message {
    color: red;
  }

  &[disabled] {
    border: none;
    color: @veui-text-color-weak;
    .veui-shadow(none);

    .veui-switch-label {
      cursor: not-allowed;
    }

    .veui-switch-icon {
      font-weight: bold;
      position: relative;
      color: @veui-gray-color-sup-1;
    }
  }

  &[readonly] {
    .veui-switch-label {
      cursor: not-allowed;

      .veui-switch-switch {
        &.veui-switch-on {
          color: @veui-theme-color-primary;
        }
        
        &.veui-switch-off {
          color: @veui-gray-color-sup-1;
        }
      }
    }
  }

  &[ui~="plain"] {
    .veui-switch-label {
      background-color: @veui-gray-color-sup-2;

      &.veui-switch-on {
        background-color: @veui-gray-color-sup-2;
      }

      &.veui-switch-off {
        left: 0;
        background-color: @veui-gray-color-sup-1;
      }
    }

    .veui-switch-switch {
      background-color: @veui-gray-color-weak;

      &.veui-switch-on {
        background-color: @veui-gray-color-weak;
      }

      &.veui-switch-off {
        background-color: #fff;
      }
    }
  }
}
</style>

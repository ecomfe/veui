<template>
  <button class="veui-button" :class="{'veui-button-loading': loading}" v-bind="attrs" @click="$emit('click', $event)">
    <template v-if="!loading"><slot></slot></template>
    <template v-else>
      <slot name="loading">
        <slot name="icon">
          <icon name="circle-o-notch" spin></icon>
        </slot>
        <span class="veui-button-loading-text">加载中…</span>
      </slot>
    </template>
  </button>
</template>

<script>
import Icon from './Icon'
import 'vue-awesome/icons/circle-o-notch'

export default {
  name: 'veui-button',
  components: {
    Icon
  },
  props: {
    ui: String,
    disabled: Boolean,
    name: String,
    type: String,
    value: String,
    autofocus: Boolean,
    loading: Boolean
  },
  computed: {
    attrs () {
      let attrs = Object.assign({}, this.$props)
      delete attrs.loading
      attrs.disabled = this.disabled || this.loading
      return attrs
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-button {
  padding: 10px 20px;
  min-width: 94px;
  height: @veui-height-normal;
  border: 1px solid @veui-theme-color-primary;
  background-color: #fff;
  color: @veui-theme-color-primary;
  border-radius: 2px;
  user-select: none;
  vertical-align: middle;
  line-height: 1;
  transition: all .2s;

  &:not(.veui-button-loading) {
    &:hover,
    &:active {
      border-color: @veui-theme-color-hover;
      color: @veui-theme-color-hover;
    }

    &:hover {
      .veui-shadow();
    }

    &:active {
      background-color: @veui-theme-color-sup-4;
      .veui-shadow(none);
    }
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;

    &:not(.veui-button-loading) {
      border: none;
      background-color: @veui-gray-color-sup-3;
      color: @veui-text-color-weak;
      .veui-shadow(none);
    }
  }

  &.veui-button-loading {
    cursor: default;
  }

  &[ui~="aux"] {
    border-color: @veui-gray-color-sup-1;
    color: @veui-text-color-normal;

    &:not(.veui-button-loading) {
      &:hover,
      &:active {
        border-color: @veui-gray-color-sup-1;
        color: @veui-text-color-strong;
      }

      &:hover {
        background-color: #fff;
      }

      &:active {
        background-color: @veui-gray-color-sup-4;
      }

      &:disabled {
        background-color: @veui-gray-color-sup-3;
        color: @veui-text-color-weak;
      }
    }
  }

  &[ui~="primary"] {
    background-color: @veui-theme-color-primary;
    color: #fff;
    .veui-shadow();

    &:not(.veui-button-loading) {
      &:hover,
      &:active {
        background-color: @veui-theme-color-hover;
        color: #fff;
        .veui-shadow(strong);
      }

      &:active {
        background-color: @veui-theme-color-active;
        .veui-shadow(none);
      }

      &:disabled {
        background-color: @veui-gray-color-sup-1;
        color: #fff;
        .veui-shadow(none);
      }
    }
  }

  &[ui~="large"] {
    .padding(12px, _);
    height: @veui-height-large;
    font-size: @veui-font-size-large;
  }

  &[ui~="small"] {
    .padding(8px, _);
    height: @veui-height-small;
    font-size: @veui-font-size-small;
  }

  &[ui~="round"] {
    border-radius: 50%;
  }

  &[ui~="round"],
  &[ui~="square"] {
    width: @veui-height-normal;
    min-width: auto;
    .padding(_, 0);
    text-align: center;

    &[ui~="large"] {
      width: @veui-height-large;
    }

    &[ui~="small"] {
      width: @veui-height-small;
    }
  }

  .fa-icon {
    max-width: 1em;
    vertical-align: text-top;
  }
}

.veui-button-loading-text {
  vertical-align: text-top;

  [ui~="round"] > &,
  [ui~="square"] > & {
    display: none;
  }
}
</style>

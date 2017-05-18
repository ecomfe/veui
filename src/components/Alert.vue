<template>
  <div v-if="localOpen" class="veui-alert" :ui="ui" :class="`veui-alert-${type}`">
    <slot name="all-content">
      <veui-icon class="veui-alert-icon" :name="`${iconName}-circle`"></veui-icon>
      <slot name="content">
        <span v-if="isMultiple" class="veui-alert-message veui-alert-message-multiple">{{ message[index] }}</span>
        <span v-else class="veui-alert-message">{{ message }}</span>
      </slot>
      <span v-if="closeText" class="veui-alert-close veui-alert-close-text" @click="close">{{ closeText }}</span>
      <span v-else class="veui-alert-close">
        <template v-if="isMultiple">
          <veui-icon :class="{'veui-alert-icon-disabled': prevDisabled}" name="chevron-left" @click.native="switchMessage(-1)"></veui-icon>
          <veui-icon :class="{'veui-alert-icon-disabled': nextDisabled}" name="chevron-right" @click.native="switchMessage(1)"></veui-icon>
        </template>
        <veui-icon v-else name="close" @click.native="close"></veui-icon>
      </span>
    </slot>
  </div>
</template>

<script>
  import Icon from './Icon'
  import 'vue-awesome/icons/check-circle'
  import 'vue-awesome/icons/exclamation-circle'
  import 'vue-awesome/icons/info-circle'
  import 'vue-awesome/icons/times-circle'
  import 'vue-awesome/icons/close'
  import 'vue-awesome/icons/chevron-left'
  import 'vue-awesome/icons/chevron-right'
  import { isArray } from 'lodash'

  const TYPE_MAP = {
    success: 'check',
    warning: 'exclamation',
    info: 'info',
    error: 'times'
  }

  export default {
    name: 'alert',
    components: {
      'veui-icon': Icon
    },
    props: {
      ui: String,
      type: {
        type: String,
        default: 'success'
      },
      message: [String, Array],
      closeText: String,
      open: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        localOpen: this.open,
        index: 0
      }
    },
    watch: {
      open (value) {
        this.localOpen = value
      }
    },
    computed: {
      iconName () {
        return TYPE_MAP[this.type]
      },
      isMultiple () {
        return isArray(this.message)
      },
      prevDisabled () {
        return this.index <= 0
      },
      nextDisabled () {
        return this.index >= this.message.length - 1
      }
    },
    methods: {
      close () {
        this.localOpen = false
        this.$emit('update:open', false)
      },
      switchMessage (step) {
        if ((step > 0 && this.nextDisabled) || (step < 0 && this.prevDisabled)) {
          return
        }
        this.index = this.index + step
      }
    }
  }
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";
.veui-alert {
  @success: @veui-success-color-primary;
  @warning: #fe9700;
  @info: @veui-theme-color-primary;
  @error: @veui-alert-color-primary;
  @iconActiveColor: #3077e5;
  @messageHoverColor: #72a9ff;
  @messageActiveColor: #5e9dff;
  position: relative;
  margin: 30px 0;
  padding: 14px 20px;
  border-radius: 2px;
  span {
    display: inline-block;
  }
  .veui-alert-icon {
    transform: translateY(-50%);
    .absolute(50%, _, _, 20px);
  }
  .veui-alert-message {
    margin: 0 44px 0 34px;
    &.veui-alert-message-multiple {
      margin-right: 82px;
    }
  }
  &.veui-alert-success {
    background-color: fadeout(@success, 90%);
    color: @success;
  }
  &.veui-alert-warning {
    background-color: fadeout(@warning, 90%);
    color: @warning;
  }
  &.veui-alert-info {
    background-color: @veui-theme-color-sup-4;
    color: @info;
  }
  &.veui-alert-error {
    background-color: fadeout(@error, 90%);
    color: @error;
  }
  .veui-alert-close {
    .absolute(50%, 20px, _, _);
    transform: translateY(-50%);
    &.veui-alert-close-text {
      cursor: pointer;
      color: @veui-theme-color-secondary;
      &:hover,
      &:visited {
        color: @messageHoverColor;
      }
      &:active {
        color: @messageActiveColor;
      }
    }
    .veui-icon {
      cursor: pointer;
      color: @veui-text-color-normal;
      &:hover,
      &:visited {
        color: @veui-theme-color-primary;
      }
      &:active {
        color: @iconActiveColor;
      }
      &+.veui-icon {
        margin-left: 24px;
      }
      &.veui-alert-icon-disabled {
        cursor: not-allowed;
        color: @veui-text-color-weak;
      }
    }
  }
}
</style>

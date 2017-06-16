<template>
  <div v-if="localOpen" class="veui-alert" :ui="ui" :class="`veui-alert-${type}`">
    <slot name="content">
      <veui-icon class="veui-alert-icon" :name="iconName"></veui-icon>
      <slot>
        <span v-if="isMultiple" class="veui-alert-message veui-alert-message-multiple">{{ message[index] }}</span>
        <span v-else class="veui-alert-message">{{ message }}</span>
      </slot>
      <button v-if="closeText" class="veui-alert-close veui-alert-close-text" @click="close">{{ closeText }}</button>
      <template v-else-if="isMultiple">
        <span class="veui-alert-close">
          <button :disabled="isFirst" @click="switchMessage(-1)">
            <veui-icon name="angle-left"></veui-icon>
          </button>
          <button :disabled="isLast" @click="switchMessage(1)">
            <veui-icon name="angle-right"></veui-icon>
          </button>
        </span>
      </template>
      <button v-else class="veui-alert-close" @click="close">
        <veui-icon name="cross"></veui-icon>
      </button>
    </slot>
  </div>
</template>

<script>
import Icon from './Icon'
import '../icons'
import { isArray } from 'lodash'

const TYPE_MAP = {
  success: 'check-circle',
  warning: 'exclamation-circle',
  info: 'info-circle',
  error: 'cross-circle'
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
    isFirst () {
      return this.index <= 0
    },
    isLast () {
      return this.index >= this.message.length - 1
    }
  },
  methods: {
    close () {
      this.localOpen = false
      this.$emit('update:open', false)
    },
    switchMessage (step) {
      if ((step > 0 && this.isLast) || (step < 0 && this.isFirst)) {
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
  @warning: @veui-warning-color-primary;
  @info: @veui-info-color-primary;
  @error: @veui-alert-color-primary;
  @message-hover-color: #72a9ff;
  @message-active-color: #5e9dff;
  position: relative;
  margin: 30px 0;
  padding: 14px 20px;
  border-radius: 2px;
  span {
    display: inline-block;
  }
  &-icon {
    transform: translateY(-50%);
    .absolute(50%, _, _, 20px);
  }
  &-message {
    margin: 0 44px 0 34px;
    &-multiple {
      margin-right: 82px;
    }
  }
  &-success {
    background-color: fadeout(@success, 90%);
    color: @success;
  }
  &-warning {
    background-color: fadeout(@warning, 90%);
    color: @warning;
  }
  &-info {
    background-color: @veui-info-color-sup-2;
    color: @info;
  }
  &-error {
    background-color: fadeout(@error, 90%);
    color: @error;
  }
  &-close {
    .absolute(50%, 20px, _, _);
    transform: translateY(-50%);
    button + button {
      margin-left: 24px;
    }
    &.veui-alert-close-text {
      color: @veui-info-color-secondary;
      &:hover,
      &:visited {
        color: @message-hover-color;
      }
      &:active {
        color: @message-active-color;
      }
    }
  }
  button {
    border: none;
    background: none;
    padding: 0;
    user-select: none;
    color: @veui-text-color-normal;
    &:focus {
      outline: none;
    }
    &:hover,
    &:visited {
      color: @veui-info-color-primary;
    }
    &:active {
      color: @veui-info-color-hover;
    }
    &:disabled {
      cursor: not-allowed;
      color: @veui-text-color-weak;
    }
  }
}
</style>

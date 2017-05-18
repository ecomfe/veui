<template>
  <div :ui="ui" class="veui-toast" :class="`veui-toast-${type}`">
    <veui-icon class="veui-toast-icon" :name="`${iconName}-circle`"></veui-icon>
    <span class="veui-toast-message">{{ message }}</span>
  </div>
</template>

<script>
  import Icon from './Icon'
  import 'vue-awesome/icons/check-circle'
  import 'vue-awesome/icons/exclamation-circle'
  import 'vue-awesome/icons/info-circle'
  import 'vue-awesome/icons/times-circle'

  const TYPE_MAP = {
    success: 'check',
    warning: 'exclamation',
    info: 'info',
    error: 'times'
  }

  export default {
    name: 'toast',
    components: {
      'veui-icon': Icon
    },
    props: {
      ui: String,
      type: {
        type: String,
        default: 'success'
      },
      message: String,
      duration: {
        type: Number,
        default: 3000
      }
    },
    computed: {
      iconName () {
        return TYPE_MAP[this.type]
      }
    },
    mounted () {
      this.timer = setTimeout(() => {
        this.$emit('close')
      }, this.duration)
    },
    beforeDestroy () {
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";
.veui-toast {
  @veui-warning-color-primary: #fe9700;
  @veui-warning-color-hover: #e48800;
  @veui-info-color-hover: #3077e5;

  .veui-toast-style(@color, @shadow-color) {
    color: @color;
    border: 1px solid fadeOut(@color, 50%);
    box-shadow: 0 1px 4px fadeOut(@shadow-color, 80%);
  }
  position: relative;
  padding: 14px 30px;
  max-width: 800px;
  background-color: #fff;
  border-radius: 2px;
  span {
    display: inline-block;
  }
  .veui-toast-message {
    margin-left: 35px;
  }
  .veui-toast-icon {
    .absolute(50%, _, _, 30px);
    transform: translateY(-50%);
  }
  &.veui-toast-success {
    .veui-toast-style(@veui-success-color-primary, @veui-success-color-hover);
  }
  &.veui-toast-warning {
    .veui-toast-style(@veui-warning-color-primary, @veui-warning-color-hover);
  }
  &.veui-toast-info {
    .veui-toast-style(@veui-theme-color-secondary, @veui-info-color-hover);
    color: @veui-theme-color-primary;
  }
  &.veui-toast-error {
    .veui-toast-style(@veui-alert-color-primary, @veui-alert-color-hover);
  }
}
</style>

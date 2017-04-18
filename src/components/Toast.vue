<template>
  <div :ui="ui" class="veui-toast" :class="`veui-toast-${type}`">
    <veui-icon class="veui-toast-icon" :name="`${iconName}-circle`"></veui-icon>
    <span class="veui-toast-text">{{ text }}</span>
  </div>
</template>

<script>
  import Icon from './Icon'
  import 'vue-awesome/icons/check-circle'
  import 'vue-awesome/icons/exclamation-circle'
  import 'vue-awesome/icons/info-circle'
  import 'vue-awesome/icons/times-circle'

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
      text: String,
      time: {
        type: Number,
        default: 3000
      }
    },
    data () {
      return {
        typeMap: {
          success: 'check',
          warn: 'exclamation',
          remind: 'info',
          error: 'times'
        }
      }
    },
    computed: {
      iconName () {
        return this.typeMap[this.type]
      }
    },
    mounted () {
      this.timer = setTimeout(() => {
        this.$emit('close')
      }, this.time)
    },
    beforeDestroy () {
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";
.veui-toast {
  .veui-toast-style(@color, @shadowColor, @fadeOut: 50%) {
    color: @color;
    border: 1px solid fadeOut(@color, @fadeOut);
    box-shadow: 0 1px 4px fadeOut(@shadowColor, 80%);
  }
  position: relative;
  padding: 14px 30px;
  max-width: 800px;
  background-color: #fff;
  border-radius: 2px;
  span {
    display: inline-block;
  }
  .veui-toast-text {
    margin-left: 35px;
  }
  .veui-toast-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 30px;
  }
  &.veui-toast-success {
    .veui-toast-style(@veui-success-color-primary, #389a91);
  }
  &.veui-toast-warn {
    .veui-toast-style(#fe9700, #e38800);
  }
  &.veui-toast-remind {
    .veui-toast-style(@veui-theme-color-primary, #3077e5, 0);
  }
  &.veui-toast-error {
    .veui-toast-style(@veui-alert-color-primary, #e55151);
  }
}
</style>

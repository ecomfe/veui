<template>
  <div v-if="localOpen" class="veui-alert" :ui="ui" :class="`veui-alert-${type}`" :style="{width}">
    <slot name="all-content">
      <veui-icon class="veui-alert-icon" :name="`${iconName}-circle`"></veui-icon>
      <slot name="content">
        <span class="veui-alert-text">{{ text }}</span>
      </slot>
      <span v-if="closeText" class="veui-alert-close veui-alert-close-text" @click="close">{{ closeText }}</span>
      <veui-icon v-else class="veui-alert-close" name="close" @click.native="close"></veui-icon>
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
      text: String,
      closeText: String,
      width: {
        type: String,
        default: '100%'
      },
      open: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        localOpen: this.open,
        typeMap: {
          success: 'check',
          warn: 'exclamation',
          remind: 'info',
          error: 'times'
        }
      }
    },
    watch: {
      open (value) {
        this.localOpen = value
      }
    },
    computed: {
      iconName () {
        return this.typeMap[this.type]
      }
    },
    methods: {
      close () {
        this.localOpen = false
        this.$emit('update:open', false)
      }
    }
  }
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";
.veui-alert {
  @success: @veui-success-color-primary;
  @warn: #fe9700;
  @remind: @veui-theme-color-primary;
  @error: @veui-alert-color-primary;
  position: relative;
  margin: 30px 0;
  padding: 14px 20px;
  border-radius: 2px;
  span {
    display: inline-block;
  }
  .veui-alert-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 20px;
  }
  .veui-alert-text {
    margin: 0 45px 0 35px;
  }
  &.veui-alert-success {
    background-color: fadeout(@success, 90%);
    color: @success;
  }
  &.veui-alert-warn {
    background-color: fadeout(@warn, 90%);
    color: @warn;
  }
  &.veui-alert-remind {
    background-color: @veui-theme-color-sup-4;
    color: @remind;
    .veui-alert-close-text {
      color: @veui-theme-color-secondary;
    }
  }
  &.veui-alert-error {
    background-color: fadeout(@error, 90%);
    color: @error;
  }
  .veui-alert-close {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    &.veui-icon {
      color: @veui-gray-color-normal;
    }
  }
}
</style>

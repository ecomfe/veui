<template>
  <div class="veui-button-group" :ui="ui" :class="`${this.vertical ? 'veui-button-group-vertical' : 'veui-button-group-horiztontal'}`" :mode="mode" :active="active"> 
    <veui-button v-for="(item, index) in items" :key="index" :ui="ui" ref="button"
    :class="{'veui-button-active': localActive == item.value || localActive.indexOf(item.value) >= 0, 'veui-button-vertical': vertical, 'veui-button-multiple': multiple}"
    @click.stop="handleClick(item)">
      <span v-if="item.icon"><icon :name="item.icon"></icon></span>
      {{ item.label }}
    </veui-button>
  </div>
</template>
<script>
  import Button from './Button'
  import Icon from './Icon'
  import {includes} from 'lodash'
  import 'vue-awesome/icons/remove'

  const ALLOWED_MODE_TYPES = ['stateless', 'exclusive', 'multiple']

  export default {
    name: 'veui-buttongroup',
    components: {
      'veui-button': Button,
      Icon
    },
    props: {
      ui: {
        type: String
      },
      active: {
        type: [Number, String, Array]
      },
      vertical: {
        type: Boolean,
        default: false
      },
      items: {
        /**
         * {
         *  label: '显示的文本',
         *  icon: '要配置的icon名字',
         *  value: '单个按钮的值'
         * }
         */
        type: Array
      },
      mode: {
        type: String,
        default: 'stateless',
        validator (value) {
          return includes(ALLOWED_MODE_TYPES, value)
        }
      },
      value: {
        type: [Number, String]
      }
    },
    data () {
      return {
        localActive: this.active || [],
        multiple: this.mode === 'multiple'
      }
    },
    methods: {
      handleClick (item) {
        switch (this.mode) {
          case 'exclusive':
            this.localActive = item.value
            break
          case 'multiple':
            if (includes(this.localActive, item.value)) {
              let newIndex = this.localActive.indexOf(item.value)
              this.localActive.splice(newIndex, 1)
            } else {
              this.localActive.push(item.value)
            }
            break
          default:
            break
        }
        this.$emit('click', item.value)

        if (this.mode !== 'stateless') {
          this.$emit('change', item.active, item.value)

          this.$emit('update:active', this.localActive)
        }
      }
    }
  }
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-button-group {
  .veui-button {
    /* border: 1px solid @veui-gray-color-sup-1; */

    &:not(:first-child):not(:last-child):not(.veui-button-multiple) {
      border-radius: 0;
    }
  }

  &-horiztontal {
    .veui-button:not(:last-child):not(.veui-button-multiple) {
      border-right: none;
    }

    .veui-button {
      &:first-child:not(.veui-button-multiple) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      &[ui~='link'] {
        margin-right: 10px;
      }

      &.veui-button-multiple {
        margin-right: 10px;
      }
    }
  }

  &.veui-button-group-vertical {
    .veui-button:not(:last-child):not(.veui-button-multiple) {
      border-bottom: none;
    }

    .veui-button {
      &:first-child {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:last-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
  }

  &:hover,
  &:active {
    border-color: @veui-theme-color-hover;
  }

  .veui-button-active {
    background-color: @veui-theme-color-primary;
    color: #fff;
    .veui-shadow();
    border-color: @veui-theme-color-primary;

    &:hover {
      color: @veui-gray-color-sup-1;
    }
  }

  .veui-button.veui-button-vertical {
      display: block;
  }
}
</style>

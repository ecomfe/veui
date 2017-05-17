<template>
  <div class="veui-button-group" :ui="ui" :class="`${this.vertical ? 'vertical' : 'horiztontal'}`" :mode="mode" :active.sync="active"> 
    <veui-button v-for="(item, index) in items" :key="index" :ui="ui" ref="button"
    :class="{active: localActive.indexOf(item.value) >= 0, vertical: vertical}"
    @click.stop="clickHandler(index, item, $event)">
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
    name: 'veui-button-group',
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
        localActive: this.active || []
      }
    },
    computed: {
    },
    methods: {
      clickHandler (index, item, $event) {
        console.log(index)

        switch (this.mode) {
          case 'exclusive':
            this.localActive = [item.value]
            console.log(this.localActive)
            break
          case 'multiple':
            if (includes(this.localActive, item.value)) {
              console.log(this.localActive)
              let newIndex = this.localActive.indexOf(item.value)
              console.log(newIndex)
              this.localActive.splice(newIndex, 1)
            } else {
              this.localActive.push(item.value)
            }
            break
          default:
            break
        }
        this.$emit('click', item.value)
        // console.log(item.value)

        if (this.mode !== 'stateless') {
          this.$emit('change', item.active, item.value)

          this.$emit('update:active', this.localActive)
          console.log(this.localActive)
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

    &:not(:first-child):not(:last-child) {
      border-radius: 0;
    }
  }

  &.horiztontal {
    .veui-button:not(:last-child) {
      border-right: none;
    }

    .veui-button {
      &:first-child {
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
    }
  }

  &.vertical {
    .veui-button:not(:last-child) {
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

  .active {
    background-color: @veui-theme-color-primary;
    color: #fff;
    .veui-shadow();
    border-color: @veui-theme-color-primary;

    &:hover {
      color: @veui-gray-color-sup-1;
    }
  }

  .veui-button.vertical {
      display: block;
  }
}
</style>

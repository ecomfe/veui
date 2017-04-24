<template>
  <div class="veui-button-group" :ui="ui" :class="orientationClass" :mode="mode" :current="current" @changestate="changeStateHandler(index)">   
    <veui-button v-for="(item, index) in items" :key="index" :ui="ui" ref="button"
    :class="{current: localCurrent === index || localCurrent.includes(index), vertical: vertical}"
    @click="clickHandler(index, $event)">
      <span v-if="item.icon"><icon :name="item.icon"></icon></span>
      {{ item.text }}
    </veui-button>
  </div>
</template>
<script>
  import Button from './Button'
  import {includes} from 'lodash'

  const ALLOWED_MODE_TYPES = ['stateless', 'exclusive', 'multiple']

  export default {
    name: 'veui-button-group',
    components: {
      'veui-button': Button,
      'props': ['current']
    },
    props: {
      ui: {
        type: String
      },
      current: {
        type: [Number, Array]
      },
      vertical: {
        type: Boolean,
        default: false
      },
      items: {
        /**
         * {
         *  text: '显示的文本',
         *  icon: '要配置的icon名字'
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
      }
    },
    data () {
      // let localCurrent = this.current && (this.current == index || this.current.includes(index))
      // console.log(this)
      return {
        orientationClass: this.vertical ? 'vertical' : 'horiztontal',
        isCurrent: false,
        localCurrent: this.current || []
      }
    },
    computed: {
      isCurrent (index) {
        let isCurrent = this.current && (this.current === index || this.current.includes(index))
        return isCurrent
      }
    },
    methods: {
      clickHandler (index, $event) {
        switch (this.mode) {
          case 'exclusive':
            // this.localCurrent = index
            this.localCurrent = []
            this.localCurrent.push(index)
            console.log(this.localCurrent === index)
            break
          case 'multiple':
            if (this.localCurrent.includes(index)) {
              this.localCurrent.splice(index, 1)
            } else {
              this.localCurrent.push(index)
            }
            console.log(this.localCurrent)
            break
          default:
            break
        }
        console.log(this.localCurrent)
        this.$emit('changestate', index)
      }
    },
    mounted () {
      this.$children.forEach((child, index) => {
        child.$on('click', (index) => {
          // this.current = index
        })
      })
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

  .current {
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

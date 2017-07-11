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
  import { includes } from 'lodash'
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

<template>
  <li class="veui-breadcrumb-item">
    <template v-if="type === 'LINK'">
      <a class="veui-breadcrumb-item-link"
        v-if="type === 'LINK'"
        :title="to"
        @click="redirect"><slot></slot></a><span class="veui-breadcrumb-item-separator">{{ separator || '' }}</span>
    </template>
    <span v-else-if="type === 'TEXT'"><slot></slot></span>
  </li>
</template>
<script>
import { includes } from 'lodash'

export default {
  name: 'veui-breadcrumb-item',
  props: {
    to: {
      type: String,
      default: null
    },
    replace: {
      type: Boolean,
      default: false
    },
    type: {
      default: 'LINK',
      validator (value) {
        return includes(['LINK', 'TEXT'], value)
      }
    },
    separator: {
      default: '|',
      type: String
    }
  },
  methods: {

    /**
     * 对hash路由进行跳转
     *
     * @private
     */
    redirectHash () {
      this.$router
        ? (
          this.replace
            ? this.$router.replace(this.to)
            : this.$router.push(this.to)
        )
        : (
          this.replace
            ? (location.hash = this.to)
            : (location.replace(location.href + this.to))
        )
    },

    /**
     * 跳转
     *
     * @private
     */
    redirect () {
      if (this.to) {
        // 只有传入了to，才会自动尝试去做跳转

        const isHashUrl = /^#/.test(this.to)
        if (isHashUrl) {
          // 如果是hash路由，则需要判断当前vm实例上是否绑定了$router，
          // 如果绑定了，则借助$router进行跳转，否则使用location进行跳转。

          this.redirectHash()
        } else {
          // 如果不是hash路由，就直接用location进行跳转。

          this.replace
            ? location.replace(this.to)
            : location.assign(this.to)
        }
      } else {
        // 如果没有传入to，直接向外部抛出跳转事件就行了

        this.$emit('redirect')
      }
    }
  }
}
</script>
<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-breadcrumb-item {
  float: left;
}

.veui-breadcrumb-item-separator {
  padding: 0 8px;
}

.veui-breadcrumb-item-link {
  cursor: pointer;
  color: @veui-theme-color-primary;
}
</style>

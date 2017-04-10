<template>
  <ul class="veui-breadcrumb"><slot></slot></ul>
</template>

<script>
import { each, filter } from 'lodash'

export default {
  name: 'veui-breadcrumb',
  props: {
    separator: {
      type: String,
      default: '|'
    }
  },
  beforeUpdate () {
    const breadcrumbItems = filter(
      this.$slots.default,
      slot => slot.componentOptions && slot.componentOptions.tag === 'veui-breadcrumb-item'
    )
    // 在子组件创建之前，塞点数据进去
    const length = breadcrumbItems.length
    each(breadcrumbItems, (itemSlot, index) => {
      if (length - 1 === index) {
        itemSlot.componentOptions.propsData.type = 'TEXT'
      } else {
        itemSlot.componentOptions.propsData.type = 'LINK'
        itemSlot.componentOptions.propsData.separator = this.separator
      }
    })
  }
}
</script>
<style lang="less">
.veui-breadcrumb {
  padding: 0;
  margin: 0;
  list-style: none;
  .clearfix();
}
</style>

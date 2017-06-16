<template>
<veui-icon class="veui-table-sorter" @click.native="sort">
  <veui-icon :class="{ 'veui-table-sorter-active': order === 'asc' }" name="sort-asc"></veui-icon>
  <veui-icon :class="{ 'veui-table-sorter-active': order === 'desc' }" name="sort-desc"></veui-icon>
</veui-icon>
</template>

<script>
import Icon from '../Icon'

export default {
  name: 'veui-table-sorter',
  components: {
    'veui-icon': Icon
  },
  props: {
    order: [String, Boolean]
  },
  methods: {
    sort () {
      let order
      if (!this.order) {
        order = 'asc'
      } else {
        order = this.order === 'asc' ? 'desc' : 'asc'
      }
      this.$emit('sort', order)
    }
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-table-sorter {
  color: @veui-gray-color-sup-1;
  cursor: pointer;

  &-active {
    color: @veui-gray-color-weak;
  }
}

</style>

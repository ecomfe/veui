<template>
  <div class="veui-tab" v-if="this.$parent.localActive === this.name">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'veui-tab',
  props: {
    label: {
      type: String,
      required: true
    },
    name: String,
    disabled: Boolean
  },
  created () {
    let { name, label, disabled } = this
    this.$parent.add({ name, label, disabled })
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-tab {
  border: 1px solid @veui-gray-color-sup-1;
  padding: 20px;
  min-height: 200px;
}
</style>

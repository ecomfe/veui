<template>
  <div class="veui-tab" v-show="isActive">
    <slot v-if="this.isInited && isActive"></slot>
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
  data () {
    return {
      isInited: false
    }
  },
  computed: {
    isActive () {
      let isActive = this.$parent.localActive === this.name
      if (isActive) {
        this.isInited = true
      }
      return isActive
    }
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

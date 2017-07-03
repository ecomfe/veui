<template>

  <div class="veui-tab" v-show="isActive">
    <slot v-if="isInited && isActive"></slot>
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
      index: null,
      isInited: false
    }
  },
  watch: {
    isActive (val) {
      this.isInited = true
    }
  },
  computed: {
    isActive () {
      return this.name
        ? this.$parent.localActive === this.name
        : this.$parent.localIndex === this.index
    }
  },
  created () {
    let { name, label, disabled, $vnode } = this

    this.index = this.$parent.$slots.default.indexOf($vnode)
    this.$parent.add({ name, label, disabled, $vnode })
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

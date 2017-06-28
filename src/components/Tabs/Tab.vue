<template>
  <div class="veui-tab-content" v-show="isActive">
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
    name: {
      default: function () {
        return this.label
      }
    }
  },

  methods: {

  },

  computed: {
    isActive () {
      return this.$parent.current === this.name
    }
  },

  created () {
    this.$parent.add(this)
  }
}
</script>

<style lang="less">

</style>

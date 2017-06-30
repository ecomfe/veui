<template>
  <div class="veui-tabs-content" v-show="this.$parent.localActive === this.name">
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

  created () {
    let name = this.name
    let label = this.label
    let renderSlots = this.$slots
    this.$parent.add({name, label, renderSlots})
  }
}
</script>


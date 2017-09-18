<template>
<icon class="veui-icon" v-bind="$props"><slot></slot></icon>
</template>
<script>
import Icon from 'vue-awesome/components/Icon'

export default {
  name: 'veui-icon',
  components: {
    Icon
  },
  props: Icon.props,
  data: Icon.data,
  computed: Icon.computed,
  register: Icon.register
}
</script>

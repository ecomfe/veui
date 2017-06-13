<template>
<icon class="veui-icon" v-bind="$props"></icon>
</template>
<script>
import Icon from 'vue-awesome/components/Icon'
export default {
  name: 'veui-icon',
  components: {
    Icon
  },
  props: Icon.props,
  register: Icon.register
}
</script>

<template>
<icon class="veui-icon" v-bind="$props"><slot/></icon>
</template>
<script>
import Icon from 'vue-awesome/components/Icon'
import ui from '../mixins/ui'

export default {
  name: 'veui-icon',
  mixins: [ui],
  components: {
    Icon
  },
  props: Icon.props,
  data: Icon.data,
  computed: Icon.computed,
  register: Icon.register
}
</script>

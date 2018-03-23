<template>
<fa-icon class="veui-icon" v-bind="$props"><slot/></fa-icon>
</template>
<script>
import FaIcon from 'vue-awesome/components/Icon'
import ui from '../mixins/ui'

export default {
  name: 'veui-icon',
  mixins: [ui],
  components: {
    FaIcon
  },
  props: FaIcon.props,
  data: FaIcon.data,
  computed: FaIcon.computed,
  register: FaIcon.register
}
</script>

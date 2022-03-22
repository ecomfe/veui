<template>
<div :class="$c('field-messages')">
  <template v-for="(validity, index) in messages">
    <component
      :is="{ render: validity.render }"
      v-if="validity.render"
      :key="index"
      :validity="validity"
    />
    <veui-message
      v-else
      :key="index"
      :title="validity.message"
      :status="validity.status"
      :icon="icon"
    >
      <span>{{ validity.message }}</span>
    </veui-message>
  </template>
</div>
</template>

<script>
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import Message from '../Message'

export default {
  name: 'veui-field-messages',
  components: {
    'veui-message': Message
  },
  mixins: [prefix, ui],
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    icon: Boolean
  }
}
</script>

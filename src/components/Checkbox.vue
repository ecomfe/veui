<template>
<input type="checkbox" v-bind.prop="$props" @change="$emit('change', $event.target.checked)">
</template>

<script>
export default {
  name: 'checkbox',
  props: ['checked', 'value', 'indeterminate'],
  model: {
    prop: 'checked',
    event: 'change'
  }
}
</script>

<template>
<input type="checkbox" ref="box" :checked="checked" :value="value" @change="$emit('change', $event.target.checked)">
</template>

<script>
export default {
  name: 'checkbox',
  props: ['checked', 'value', 'indeterminate'],
  model: {
    prop: 'checked',
    event: 'change'
  },
  watch: {
    indeterminate (newValue) {
      this.$refs.box.indeterminate = newValue
    }
  }
}
</script>

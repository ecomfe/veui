<template>
<veui-icon class="veui-sorter" @click.native="sort">
  <veui-icon :class="{ 'veui-sorter-active': order === 'asc' }" :name="icons.asc"></veui-icon>
  <veui-icon :class="{ 'veui-sorter-active': order === 'desc' }" :name="icons.desc"></veui-icon>
</veui-icon>
</template>

<script>
import Icon from './Icon'
import { icons } from '../mixins'

export default {
  name: 'veui-sorter',
  mixins: [icons],
  components: {
    'veui-icon': Icon
  },
  props: {
    order: [String, Boolean]
  },
  methods: {
    sort () {
      let order
      if (!this.order) {
        order = 'asc'
      } else {
        order = this.order === 'asc' ? 'desc' : 'asc'
      }
      this.$emit('sort', order)
    }
  }
}
</script>

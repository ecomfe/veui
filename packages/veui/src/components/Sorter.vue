<template>
<veui-icon class="veui-sorter" :class="stateClass" @click.native="sort">
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
  computed: {
    stateClass () {
      if (this.order) {
        return `veui-sorter-${this.order}`
      }
      return 'veui-sorter-unordered'
    }
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

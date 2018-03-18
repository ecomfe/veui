<template>
<veui-icon :ui="ui" :class="klass" @click.native="sort">
  <veui-icon :class="{ 'veui-sorter-active': order === 'asc' }" :name="icons.asc"/>
  <veui-icon :class="{ 'veui-sorter-active': order === 'desc' }" :name="icons.desc"/>
</veui-icon>
</template>

<script>
import Icon from './Icon'
import ui from '../mixins/ui'

export default {
  name: 'veui-sorter',
  mixins: [ui],
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
    },
    klass () {
      return {
        'veui-sorter': true,
        [this.stateClass]: true
      }
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

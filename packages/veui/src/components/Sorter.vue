<template>
<veui-icon
  :ui="realUi"
  :class="klass"
  @click.native="sort"
>
  <veui-icon
    :class="{
      'veui-sorter-icon-asc': true,
      'veui-sorter-active': order === 'asc',
      'veui-sorter-inactive': order === 'desc'
    }"
    :name="icons.asc"
  />
  <veui-icon
    :class="{
      'veui-sorter-icon-desc': true,
      'veui-sorter-active': order === 'desc',
      'veui-sorter-inactive': order === 'asc'
    }"
    :name="icons.desc"
  />
</veui-icon>
</template>

<script>
import Icon from './Icon'
import ui from '../mixins/ui'

export default {
  name: 'veui-sorter',
  components: {
    'veui-icon': Icon
  },
  mixins: [ui],
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

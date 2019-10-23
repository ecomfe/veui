<template>
<veui-icon
  :ui="realUi"
  :class="klass"
  @click.native="sort"
>
  <veui-icon
    :class="{
      [$c('sorter-icon-asc')]: true,
      [$c('sorter-active')]: order === 'asc',
      [$c('sorter-inactive')]: order === 'desc'
    }"
    :name="icons.asc"
  />
  <veui-icon
    :class="{
      [$c('sorter-icon-desc')]: true,
      [$c('sorter-active')]: order === 'desc',
      [$c('sorter-inactive')]: order === 'asc'
    }"
    :name="icons.desc"
  />
</veui-icon>
</template>

<script>
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'

export default {
  name: 'veui-sorter',
  components: {
    'veui-icon': Icon
  },
  mixins: [prefix, ui],
  props: {
    order: [String, Boolean]
  },
  computed: {
    stateClass () {
      if (this.order) {
        return this.$c(`sorter-${this.order}`)
      }
      return this.$c('sorter-unordered')
    },
    klass () {
      return {
        [this.$c('sorter')]: true,
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

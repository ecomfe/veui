<template>
<div
  :class="{
    [$c('layout')]: true,
    [$c(`layout-${direction || hasSidebar() ? 'row' : 'column'}`)]: true,
    [$c('layout-has-sidebar')]: hasSidebar()
  }"
>
  <slot/>
</div>
</template>

<script>
import ui from '../../mixins/ui'
import Sidebar from './Sidebar'

export default {
  name: 'veui-layout',
  uiTypes: ['transparent'],
  mixins: [ui],
  props: {
    direction: {
      type: String,
      validator (val) {
        return ['column', 'row'].indexOf(val) >= 0
      }
    }
  },
  methods: {
    hasSidebar () {
      let children = this.$slots.default
      children = children ? [].concat(children) : []
      return children
        .filter(({ componentOptions } = {}) => !!componentOptions)
        .some(
          ({ componentOptions }) =>
            componentOptions.Ctor.options.name === Sidebar.name
        )
    }
  }
}
</script>

<template>
<button
  :class="{
    [$c('button')]: true,
    [$c('button-loading')]: loading,
    [$c('disabled')]: disabled,
    [$c('button-icon-only')]: iconOnly
  }"
  :ui="realUi"
  v-bind="attrs"
  v-on="$listeners"
>
  <slot v-if="!loading"/>
  <template v-else>
    <slot name="loading">
      <veui-icon
        :class="$c('button-loading-icon')"
        :name="icons.loading"
        spin
      />
      <slot/>
    </slot>
  </template>
</button>
</template>

<script>
import { omit } from 'lodash'
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import { hasClass as vnodeHasClass } from '../utils/helper'

export default {
  name: 'veui-button',
  components: {
    'veui-icon': Icon
  },
  mixins: [prefix, ui, focusable],
  props: {
    disabled: Boolean,
    name: String,
    type: {
      type: String,
      default: 'button'
    },
    value: String,
    loading: Boolean
  },
  data () {
    return {
      iconOnly: false
    }
  },
  computed: {
    attrs () {
      let props = omit(this.$props, 'loading')
      props.disabled = this.disabled || this.loading
      return props
    }
  },
  created () {
    this.checkIcon()
  },
  updated () {
    this.checkIcon()
  },
  methods: {
    checkIcon () {
      // Temporary hack until we can find a pure CSS solution
      let content = (this.$slots.default || []).filter(
        vnode =>
          (vnode.tag || vnode.text) &&
          !vnodeHasClass(vnode, this.$c('check-button-group-checkmark'))
      )
      if (content) {
        let vnode = content[0]
        this.iconOnly =
          content.length === 1 &&
          vnode.componentOptions &&
          vnode.componentOptions.Ctor.options.name === 'veui-icon'
      }
    },
    focus () {
      this.$el.focus()
    }
  }
}
</script>

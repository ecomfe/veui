<template>
<label
  :class="$c('label')"
  :ui="realUi"
  @click="activateInput"
>
  <slot/>
</label>
</template>

<script>
import { isFunction } from 'lodash'
import { getTypedAncestor, isType, isVueComponent } from '../utils/helper'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'

export default {
  name: 'veui-label',
  mixins: [prefix, ui],
  props: {
    for: {
      type: process.env.VUE_ENV === 'server' ? true : [String, Object, HTMLElement],
      default: null
    }
  },
  methods: {
    getTarget () {
      // String
      if (typeof this.for === 'string') {
        return this.for ? this.$vnode.context.$refs[this.for] : null
      }

      // Vue
      if (isVueComponent(this.for)) {
        return this.for
      }

      // Element
      return this.for
    },
    /**
     * Why not implement this in the `Field` component?
     *
     * Basically it should, but this make it hard if we overwrite `label` slot
     * when we are using a `Field` that we have to manually handle `click` events
     * and then call `activate` method for the `Field`.
     */
    activateInput () {
      if (window.getSelection().toString().length) {
        return
      }

      let target = this.getTarget()

      if (!target) {
        target = findInput(this)

        if (!target) {
          target = findInput(getTypedAncestor(this, 'form-field'))
        }
      }

      if (!target) {
        return
      }

      if (isFunction(target.activate)) {
        target.activate()
        return
      }

      if (target instanceof Element) {
        target.click()
      }
    }
  }
}

function findInput (component) {
  if (!component || component === this) {
    return null
  }
  if (isType(component, 'input')) {
    return component
  }

  let children = component.$children || []
  if (!children.length) {
    return null
  }

  let result
  children.some(c => {
    result = findInput(c)
    return result
  })
  return result
}
</script>

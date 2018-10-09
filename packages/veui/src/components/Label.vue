<template>
<label class="veui-label" :ui="realUi" @click="activateInput"><slot/></label>
</template>

<script>
import { isFunction } from 'lodash'
import { getTypedAncestor, isType } from '../utils/helper'
import ui from '../mixins/ui'

export default {
  name: 'veui-label',
  mixins: [ui],
  methods: {
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

      let field = getTypedAncestor(this, 'field')
      let target = this.findInput(field)
      if (target && isFunction(target.activate)) {
        target.activate()
      }
    },
    findInput (component) {
      if (component === this) {
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
        result = this.findInput(c)
        return result
      })
      return result
    }
  }
}
</script>

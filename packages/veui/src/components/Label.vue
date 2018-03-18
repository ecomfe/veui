<template>
<label class="veui-label" :ui="ui" @click="findLabeledInput"><slot></slot></label>
</template>

<script>
import { isFunction, get, includes } from 'lodash'
import { getTypedAncestor } from '../utils/helper'
import ui from '../mixins/ui'

export default {
  name: 'veui-label',
  mixins: [ui],
  methods: {
    findLabeledInput () {
      if (window.getSelection().toString().length) {
        return
      }
      let ancestor = getTypedAncestor(this, 'field')
      if (ancestor) {
        let target = ancestor.$children.filter(child => child !== this)[0]
        while (target && !includes(get(target, '$options.uiTypes', []), 'input')) {
          target = get(target, '$children[0]')
        }

        if (target && isFunction(target.activate)) {
          target.activate()
        }
      }
    }
  }
}
</script>

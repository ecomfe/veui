<template>
<label class="veui-label" :ui="ui" @click="findLabeledInput"><slot/></label>
</template>

<script>
import { isFunction, get } from 'lodash'
import { getTypedAncestor, isType } from '../utils/helper'
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
        while (target && !isType(target, 'input')) {
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

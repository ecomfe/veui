<template>
<div :ui="realUi" :class="$c('accordion')">
  <slot/>
</div>
</template>

<script>
import ui from '../mixins/ui'
import { useParent } from '../mixins/coupled'
import prefix from '../mixins/prefix'
import useControllable from '../mixins/controllable'
import { clone } from 'lodash'
import { togglePositionProp } from './Collapse'
import '../common/global'

let accordion = useParent('accordion', 'accordion-item', {
  childrenKeys: 'items'
})

export default {
  name: 'veui-accordion',
  uiTypes: ['accordion'],
  mixins: [prefix, ui, accordion, useControllable(['expanded'])],
  props: {
    multiple: Boolean,
    disabled: Boolean,
    expanded: [Number, String, Array],
    togglePosition: togglePositionProp
  },
  methods: {
    toggleById (id) {
      let item = this.findChildById(id)
      let key = item.name || item.childId
      let expanded = clone(this.realExpanded)
      let expand = false
      if (!this.multiple) {
        if (expanded === key) {
          expanded = null
        } else {
          expanded = key
          expand = true
        }
      } else {
        expanded = expanded || []
        let index = expanded.indexOf(key)
        if (index !== -1) {
          expanded.splice(index, 1)
        } else {
          expanded.push(key)
          expand = true
        }
      }
      this.commit('expanded', expanded)
      this.$emit('toggle', expand, key, expanded)
    }
  }
}
</script>

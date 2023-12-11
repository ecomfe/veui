<template>
<div
  :ui="realUi"
  :class="{
    [$c('collapse')]: true,
    [$c(`collapse-${realExpanded ? 'expanded' : 'collapsed'}`)]: true,
    [$c('disabled')]: realDisabled
  }"
>
  <div
    :class="$c('collapse-header')"
    :tabindex="realDisabled ? null : '0'"
    @click="toggle"
    @keydown.enter.space.prevent="toggle"
  >
    <veui-icon
      v-if="realTogglePosition !== 'none'"
      :class="{
        [$c('collapse-toggle')]: true,
        [$c('collapse-toggle-end')]: realTogglePosition === 'end'
      }"
      :name="icons.collapse"
    />
    <slot name="title">{{ label }}</slot>
    <div :class="$c('collapse-title-after')">
      <slot name="title-after"/>
    </div>
  </div>
  <veui-expand-transition :name="$c('collapse-body')">
    <div v-if="realExpanded" :class="$c('collapse-body')">
      <div :class="$c('collapse-content')">
        <slot/>
      </div>
    </div>
  </veui-expand-transition>
</div>
</template>

<script>
import { find } from 'lodash'
import Icon from './Icon'
import ExpandTransition from './_ExpandTransition'
import ui from '../mixins/ui'
import { useChild } from '../mixins/coupled'
import useControllable from '../mixins/controllable'
import '../common/global'

let accordionItem = useChild('accordion-item', 'accordion', ['name'], {
  direct: true
})

export const togglePositionProp = {
  type: String,
  validator (val) {
    return [null, 'start', 'end', 'none'].indexOf(val) >= 0
  }
}

export default {
  name: 'veui-collapse',
  components: {
    'veui-icon': Icon,
    'veui-expand-transition': ExpandTransition
  },
  mixins: [
    ui,
    accordionItem,
    useControllable({
      prop: 'expanded',
      get (val) {
        let { accordion } = this
        if (accordion) {
          let expanded =
            accordion.realExpanded === null
              ? []
              : [].concat(accordion.realExpanded)
          return (
            expanded
              .map((key) => {
                let item = find(
                  accordion.items,
                  ({ name, id }) => (name || id) === key
                )
                if (item) {
                  return item.id
                }
              })
              .indexOf(this.childId) !== -1
          )
        }

        return val
      }
    })
  ],
  props: {
    label: {
      type: String,
      required: true
    },
    expanded: Boolean,
    togglePosition: togglePositionProp,
    disabled: Boolean,
    name: {
      type: [String, Number],
      default () {}
    }
  },
  computed: {
    realDisabled () {
      let { accordion } = this
      if (accordion) {
        return accordion.disabled || this.disabled
      }
      return this.disabled
    },
    realTogglePosition () {
      return this.inheritFromAccordion('togglePosition') || 'start'
    }
  },
  methods: {
    toggle () {
      if (this.realDisabled) {
        return
      }

      let expanded = !this.realExpanded
      if (!this.accordion) {
        this.commit('expanded', expanded)
      } else {
        this.accordion.toggleById(this.childId)
      }
      this.$emit('toggle', expanded)
    },
    inheritFromAccordion (field) {
      let { accordion } = this
      if (accordion && this[field] == null) {
        return accordion[field]
      }
      return this[field]
    }
  }
}
</script>

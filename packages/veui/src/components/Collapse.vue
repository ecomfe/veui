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
      :class="$c('collapse-toggle')"
      :name="icons.collapse"
    />
    <slot name="title">{{ label }}</slot>
  </div>
  <veui-expand-transition :name="$c('collapse-body')">
    <div
      v-if="realExpanded"
      :class="$c('collapse-body')"
    >
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
import { useCoupledChild } from '../mixins/coupled'
import prefix from '../mixins/prefix'
import useControllable from '../mixins/controllable'

let accordionItem = useCoupledChild({
  direct: true,
  type: 'accordion-item',
  parentType: 'accordion',
  fields: ['name']
})

export default {
  name: 'veui-collapse',
  components: {
    'veui-icon': Icon,
    'veui-expand-transition': ExpandTransition
  },
  mixins: [prefix, ui, accordionItem, useControllable({
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
            .map(key => {
              let item = find(
                accordion.items,
                ({ name, id }) => (name || id) === key
              )
              if (item) {
                return item.id
              }
            })
            .indexOf(this.id) !== -1
        )
      }

      return val
    }
  })],
  props: {
    label: {
      type: String,
      required: true
    },
    expanded: {
      validator (val) {
        return typeof val === 'boolean'
      }
    },
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
        this.accordion.toggleById(this.id)
      }
      this.$emit('toggle', expanded)
    }
  }
}
</script>

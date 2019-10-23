<template>
<div
  :ui="ui"
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
  <transition
    :name="$c('collapse-body')"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <div
      v-if="realExpanded"
      :class="$c('collapse-body')"
    >
      <div :class="$c('collapse-content')">
        <slot/>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import { find } from 'lodash'
import Icon from './Icon'
import ui from '../mixins/ui'
import { makeCoupledChild } from '../mixins/coupled'
import prefix from '../mixins/prefix'

let accordionItem = makeCoupledChild({
  direct: true,
  type: 'accordion-item',
  parentType: 'accordion',
  fields: ['name']
})

export default {
  name: 'veui-collapse',
  components: {
    'veui-icon': Icon
  },
  mixins: [prefix, ui, accordionItem],
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
  data () {
    return {
      localExpanded: null
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
    realExpanded () {
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
      return this.expanded === undefined ? this.localExpanded : this.expanded
    }
  },
  watch: {
    expanded (val) {
      this.localExpanded = val
    }
  },
  methods: {
    toggle () {
      if (this.realDisabled) {
        return
      }

      let expanded = !this.realExpanded
      if (!this.accordion) {
        this.localExpanded = expanded
        this.$emit('update:expanded', expanded)
      } else {
        this.accordion.toggleById(this.id)
      }
      this.$emit('toggle', expanded)
    },
    beforeEnter (el) {
      this.originalHeight = ''
      el.style.height = '0'
    },
    enter (el) {
      if (el.scrollHeight) {
        el.style.height = `${el.scrollHeight}px`
      }
    },
    afterEnter (el) {
      el.style.height = this.originalHeight
    },
    beforeLeave (el) {
      el.style.height = `${el.scrollHeight}px`
    },
    leave (el) {
      if (el.scrollHeight) {
        el.style.height = '0'
      }
    },
    afterLeave (el) {
      el.style.height = this.originalHeight
    }
  }
}
</script>

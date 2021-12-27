<template>
<div
  :class="{
    [$c('layout-sidebar')]: true,
    [$c('layout-sidebar-collapsed')]: realCollapsed,
    [$c('layout-sidebar-sticky')]: sticky,
    [$c(`layout-sidebar-mode-${collapseMode}`)]: true
  }"
>
  <div :class="$c('layout-sidebar-content')">
    <slot/>
  </div>
  <div
    v-if="collapsible && collapseMode === 'slim'"
    :class="$c('layout-sidebar-toggle')"
  >
    <div
      v-if="!realCollapsed"
      :class="$c('layout-sidebar-toggle-extra')"
    >
      <slot name="toggle-extra"/>
    </div>
    <veui-button
      ui="icon"
      :class="$c('layout-sidebar-toggle-inside')"
      @click="updateCollapsed(!realCollapsed)"
    >
      <veui-icon :name="realCollapsed ? icons.expand : icons.collapse"/>
    </veui-button>
  </div>
  <veui-button
    v-if="collapsible && collapseMode === 'hidden'"
    :class="$c('layout-sidebar-float-toggle')"
    @click="updateCollapsed(!realCollapsed)"
  >
    <veui-icon
      :name="realCollapsed ? icons.hiddenExpand : icons.hiddenCollapse"
    />
  </veui-button>
</div>
</template>

<script>
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import useControllable from '../../mixins/controllable'
import Button from '../Button'
import Icon from '../Icon'
import { throttle } from 'lodash'

const MIN_WIDTH = 1248

export default {
  name: 'veui-sidebar',
  components: {
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [prefix, ui, useControllable('collapsed')],
  props: {
    collapsible: {
      type: Boolean,
      default: true
    },
    collapsed: {
      type: Boolean,
      default: null
    },
    collapseMode: {
      type: String,
      default: 'slim',
      validator (val) {
        return ['slim', 'hidden'].indexOf(val) >= 0
      }
    },
    autoCollapse: Boolean,
    sticky: Boolean
  },
  watch: {
    autoCollapse: {
      handler (val) {
        if (val && process.env.VUE_ENV !== 'server') {
          this.handleInitialAutoCollapse()
          if (!this.listenerAdded) {
            this.addAutoCollapse()
          }
        }
      },
      immediate: true
    }
  },
  beforeDestroy () {
    if (this.listenerAdded) {
      window.removeEventListener('resize', this.throttled, false)
      this.listenerAdded = false
    }
  },
  methods: {
    addAutoCollapse () {
      if (!this.throttled) {
        this.throttled = throttle(this.handleAutoCollapse, 200, {
          leading: true,
          trailing: false
        })
      }

      window.addEventListener('resize', this.throttled, false)
      this.listenerAdded = true
    },
    handleAutoCollapse () {
      if (this.autoCollapse && this.isCrossMinWidth()) {
        this.updateCollapsed(true, true)
      }
    },
    handleInitialAutoCollapse () {
      if (this.autoCollapse && this.isReachingMinWidth()) {
        this.updateCollapsed(true, true)
      }
    },
    isReachingMinWidth () {
      return document.documentElement.clientWidth <= MIN_WIDTH
    },
    isCrossMinWidth () {
      const htmlWidth = document.documentElement.clientWidth
      const result =
        this.prevWidth != null &&
        this.prevWidth > MIN_WIDTH &&
        htmlWidth <= MIN_WIDTH
      this.prevWidth = htmlWidth
      return result
    },
    updateCollapsed (val, isAuto) {
      if (this.realCollapsed !== val) {
        this.commit('collapsed', val)
        this.$emit('toggle', val, !!isAuto)
      }
    }
  }
}
</script>

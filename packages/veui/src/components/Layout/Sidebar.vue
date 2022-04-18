<template>
<aside
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
</aside>
</template>

<script>
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import useControllable from '../../mixins/controllable'
import Button from '../Button'
import Icon from '../Icon'
import { throttle } from 'lodash'
import { useCoupled } from '../Form/_facade' // TODO

const MIN_WIDTH = 1248

const { useParent, useChild: useSidebarChild } = useCoupled('sidebar')

export { useSidebarChild }

export default {
  name: 'veui-sidebar',
  components: {
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [
    prefix,
    ui,
    useControllable('collapsed'),
    useParent((vm) => ({
      collapsed: !!vm.realCollapsed
    }))
  ],
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
    autocollapse: Boolean,
    sticky: Boolean
  },
  watch: {
    autocollapse: {
      handler (val) {
        if (val && process.env.VUE_ENV !== 'server') {
          this.handleInitialAutoCollapse()
          if (!this.autocollapseInited) {
            this.initAutocollapse()
          }
        }
      },
      immediate: true
    }
  },
  beforeDestroy () {
    if (this.autocollapseInited) {
      window.removeEventListener('resize', this.resizeHandler, false)
      this.autocollapseInited = false
    }
  },
  methods: {
    initAutocollapse () {
      if (!this.resizeHandler) {
        this.resizeHandler = throttle(this.handleAutoCollapse, 200, {
          leading: true,
          trailing: false
        })
      }

      window.addEventListener('resize', this.resizeHandler, false)
      this.autocollapseInited = true
    },
    handleAutoCollapse () {
      if (this.autocollapse && this.shouldCollapse()) {
        this.updateCollapsed(true, true)
      }
    },
    handleInitialAutoCollapse () {
      if (this.autocollapse && this.shouldCollapse(true)) {
        this.updateCollapsed(true, true)
      }
    },
    shouldCollapse (initial) {
      const htmlWidth = document.documentElement.clientWidth
      if (initial) {
        return htmlWidth <= MIN_WIDTH
      }
      const prevWidth = this.prevWidth
      this.prevWidth = htmlWidth
      return (
        prevWidth != null && prevWidth > MIN_WIDTH && htmlWidth <= MIN_WIDTH
      )
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

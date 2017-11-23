<template>
<div class="veui-tabs" :ui="ui">
  <div class="veui-tabs-menu" ref="menu">
    <div class="veui-tabs-list">
      <template v-for="(tab, index) in items">
        <div :key="tab.name" v-if="tab.to" class="veui-tabs-item" :ref="`tab-${tab.name}`" :class="{
          'veui-tabs-item-disabled': tab.disabled,
          'veui-tabs-item-active': index === localIndex
        }">
          <slot name="tab-item" v-bind="tab">
            <veui-link :to="tab.to" :native="tab.native">{{ tab.label }}</veui-link>
            <icon :name="`cross-${(ui || '').split(' ').indexOf('large') ? 'large' : 'small'}`" v-if="tab.removable" @click.native="$emit('remove', tab)"></icon>
          </slot>
        </div>
        <div :key="tab.name" v-else class="veui-tabs-item" :ref="`tab-${tab.name}`" :class="{
          'veui-tabs-item-disabled': tab.disabled,
          'veui-tabs-item-active': index === localIndex
        }">
          <slot name="tab-item" v-bind="tab">
            <span @click="!tab.disabled && setActive({index})">{{ tab.label }}</span>
            <slot name="tab-item-extra" v-bind="tab">
              <icon :name="`cross-${(ui || '').split(' ').indexOf('large') !== -1 ? 'large' : 'small'}`"
                v-if="tab.removable"
                @click.native="$emit('remove', tab)"></icon>
            </slot>
          </slot>
        </div>
      </template>
      <object v-if="addable" ref="resizeHandler" @load="registerResizeHanlder" type="text/html" data="about:blank"></object>
    </div>
    <slot name="tabs-extra" v-if="!$slots.tabsExtra && addable">
      <div class="veui-tabs-extra" ref="extra" :class="{'veui-tabs-extra-overflow': menuOverflow}">
        <div class="veui-tabs-operator" @click="$emit('add')">
          <icon name="plus-circle-o"></icon><slot name="tabs-extra-text"><span>添加TAB</span></slot>
        </div>
        <div class="veui-tabs-scroller" v-if="menuOverflow">
          <span class="veui-tabs-scroller-left" @click="scroll('left')"><icon :name="`angle-left-${(ui || '').split(' ').indexOf('large') !== -1 ? 'large' : 'small'}`"></icon></span>
          <span class="veui-tabs-scroller-right" @click="scroll('right')"><icon :name="`angle-right-${(ui || '').split(' ').indexOf('large') !== -1 ? 'large' : 'small'}`"></icon></span>
        </div>
      </div>
    </slot>
  </div>
  <slot class="veui-tabs-panel"></slot>
</div>
</template>

<script>
import Link from '../Link'
import Icon from '../Icon'
import { includes, get, uniqueId, findIndex } from 'lodash'
import 'veui-theme-one/icons/cross-small'
import 'veui-theme-one/icons/cross-large'
import 'veui-theme-one/icons/plus-circle-o'
import 'veui-theme-one/icons/angle-left-small'
import 'veui-theme-one/icons/angle-left-large'
import 'veui-theme-one/icons/angle-right-small'
import 'veui-theme-one/icons/angle-right-large'

export default {
  name: 'veui-tabs',
  uiTypes: ['tabs'],
  components: {
    'veui-link': Link,
    Icon
  },
  props: {
    ui: {
      type: String,
      default: 'default'
    },
    active: {
      type: String
    },
    index: {
      type: Number,
      default: 0
    },
    addable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: [],
      localIndex: null,
      localActive: '',
      menuOverflow: false
    }
  },
  computed: {
    tabNames () {
      return this.items.map(item => item.name)
    }
  },
  methods: {
    add (tab) {
      let names = this.items.map(tab => tab.name)
      let tabIndex = names.length

      if (!tab.name || names.indexOf(tab.name) !== -1) {
        tab.name = uniqueId('veui-tabs-item-')
      }

      if (tab.name === this.active || !this.localActive) {
        this.localActive = tab.name
        this.localIndex = tabIndex
      }

      if (tabIndex === this.index || this.localIndex == null) {
        this.localActive = tab.name
        this.localIndex = tabIndex
      }

      this.items.push(tab)
    },

    remove (index) {
      let items = this.items
      items.splice(index, 1)

      if (items.length) {
        if (!(index === 0 && index === this.localIndex) && index <= this.localIndex) {
          this.localIndex = this.localIndex - 1
        }
        this.localActive = this.items[this.localIndex].name
      } else {
        this.localIndex = null
        this.localActive = ''
      }

      this.updateIndex()
    },

    patchIndex (oldIndex, newIndex) {
      let item = this.items[this.localIndex]

      if (oldIndex && newIndex) {
        this.items.splice(newIndex, 0, this.items.splice(oldIndex, 1)[0])
        this.updateIndex()
      }

      this.localIndex = this.items.indexOf(item)
    },

    updateIndex () {
      this.$children.forEach(component => {
        if (includes(get(component, '$options.uiTypes', []), 'tab')) {
          component.index = findIndex(
            this.items,
            item => item.name === component.name || item.name === component.to
          )
        }
      })
    },

    setActive ({active, index}) {
      let values = this.tabNames

      this.localIndex = index !== undefined ? index : values.indexOf(active)
      this.localActive = active !== undefined ? active : values[index]

      if (this.menuOverflow) {
        let {menu, extra} = this.$refs
        let offset = this.$refs[`tab-${this.localActive}`][0].getBoundingClientRect()
        let extraLeft = extra.getBoundingClientRect().left

        if (offset.left > extraLeft) {
          menu.scrollLeft += offset.right - extraLeft
        }
      }
    },

    registerResizeHanlder (e) {
      let handler = e.target
      handler.contentDocument.defaultView.addEventListener('resize', () => {
        let {menu, extra} = this.$refs
        let menuWidth = menu.getBoundingClientRect().width
        let handlerWidth = handler.getBoundingClientRect().width
        let stickyWidth = extra.getBoundingClientRect().width

        this.menuOverflow = menuWidth < handlerWidth + stickyWidth
        if (!this.menuOverflow) {
          menu.style.paddingRight = 0
        } else {
          this.$nextTick(() => {
            menu.style.paddingRight = extra.getBoundingClientRect().width + 'px'
          })
        }
      })
    },

    scroll (direction) {
      this.$refs.menu.scrollLeft += direction === 'right' ? 100 : -100
    }
  },
  watch: {
    active (val) {
      if (val === this.localActive) {
        return
      }
      this.setActive({
        active: val
      })
    },
    index (val) {
      if (val === this.localIndex) {
        return
      }
      this.setActive({
        index: val
      })
    },
    localIndex (val) {
      this.$emit('update:index', val)
    },
    localActive (val) {
      this.$emit('update:active', val)
    }
  },
  destroyed () {
    let view = get(this, '$refs.resizeHandler.contentDocument.defaultView')
    view && view.removeEventListener('resize')
  }
}
</script>

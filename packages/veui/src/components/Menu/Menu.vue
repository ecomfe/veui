<template>
<div
  :ui="realUi"
  :class="{
    [$c('menu')]: true,
    [$c('menu-collapsed')]: realCollapsed
  }"
>
  <div :class="[$c('menu-tree-wrapper')]">
    <slot name="before"/>
    <veui-tree
      ref="tree"
      :class="{
        [$c('menu-tree')]: true,
        [$c('menu-tree-has-icon')]: hasIcon
      }"
      :datasource="normalizedItems"
      :expanded="realExpanded"
      keys="name"
    >
      <template
        slot="item"
        slot-scope="link"
      >
        <div
          :ref="`item-${link.name}`"
          :class="{
            [$c('menu-item')]: true,
            ...itemClass(link)
          }"
          @click.stop="handleItemClick(link, true)"
          @mouseenter="show(link)"
        >
          <slot
            name="item"
            v-bind="link"
          >
            <div
              v-if="link.icon || $scopedSlots.icon || $slots.icon"
              :class="$c('menu-item-icon')"
            >
              <slot
                name="icon"
                v-bind="link"
              >
                <veui-icon :name="link.icon"/>
              </slot>
            </div>
            <slot
              name="item-label"
              v-bind="link"
            >
              <veui-link
                :class="$c('menu-link')"
                :disabled="!!link.disabled"
                v-bind="pickLinkProps(link)"
              >
                <span
                  v-if="!realCollapsed"
                  :class="$c('menu-item-label')"
                >{{
                  link.label
                }}</span>
              </veui-link>
            </slot>
            <veui-button
              v-if="
                !realCollapsed &&
                  !link.disabled &&
                  link.children &&
                  link.children.length
              "
              :ui="uiParts.toggle"
              tabindex="-1"
              :class="$c('menu-item-toggle')"
              @click.stop="toggleExpanded(link)"
            >
              <veui-icon
                :class="$c('menu-toggle-icon')"
                :name="link.expanded ? icons.collapse : icons.expand"
              />
            </veui-button>
          </slot>
        </div>
      </template>
    </veui-tree>
    <slot name="after"/>
  </div>
  <veui-overlay
    v-if="realCollapsed"
    :target="refTarget"
    :open.sync="open"
    :options="realOverlayOptions"
    position="right-start"
    :overlay-class="$c('menu-overlay')"
    trigger="hover"
  >
    <veui-option-group
      v-outside="{
        refs: outsideRefs,
        delay: 100,
        trigger: 'hover',
        handler: close
      }"
      :overlay-class="$c('menu-overlay')"
      :options="currentOptions"
      position="popup"
      trigger="hover"
      option-tag="div"
    >
      <template
        slot="option"
        slot-scope="link"
      >
        <slot
          name="item"
          v-bind="link"
        >
          <div
            :class="{
              [$c('menu-item')]: true,
              ...itemClass(link)
            }"
            @click="handleItemClick(link)"
          >
            <slot
              name="item-label"
              v-bind="link"
            >
              <veui-link
                :class="{
                  [$c('menu-link')]: true
                }"
                v-bind="pickLinkProps(link)"
              >
                <span :class="$c('menu-item-label')">{{ link.label }}</span>
              </veui-link>
            </slot>
          </div>
        </slot>
      </template>
      <template
        slot="option-group-label"
        slot-scope="link"
      >
        <slot
          name="item"
          v-bind="link"
        >
          <div
            :class="{
              [$c('menu-item')]: true,
              ...itemClass(link.option)
            }"
            @click="handleGroupLabelClick(link.option, link.closeMenu)"
          >
            <slot
              name="item-label"
              v-bind="link"
            >
              <veui-link
                :class="$c('menu-link')"
                v-bind="pickLinkProps(link.option)"
              >
                <span :class="$c('menu-item-label')">{{ link.label }}</span>
              </veui-link>
            </slot>
          </div>
        </slot>
      </template>
    </veui-option-group>
  </veui-overlay>
  <div
    v-if="collapsible"
    :class="$c('menu-footer')"
  >
    <veui-button
      :ui="uiParts.toggle"
      :class="$c('menu-toggle')"
      @click="toggleCollapsed"
    >
      <veui-icon
        :class="$c('menu-toggle-icon')"
        :name="realCollapsed ? icons.expand : icons.collapse"
      />
    </veui-button>
  </div>
</div>
</template>

<script>
import Tree from '../Tree'
import Icon from '../Icon'
import Link from '../Link'
import Button from '../Button'
import OptionGroup from '../OptionGroup'
import Overlay from '../Overlay'
import { some, uniq } from 'lodash'
import controllable from '../../mixins/controllable'
import mixin from './_mixin'
import '../../common/uiTypes'

export default {
  name: 'veui-menu',
  components: {
    'veui-tree': Tree,
    'veui-link': Link,
    'veui-icon': Icon,
    'veui-option-group': OptionGroup,
    'veui-overlay': Overlay,
    'veui-button': Button
  },
  mixins: [
    mixin,
    controllable([
      {
        prop: 'collapsed',
        get () {
          return this.collapsible ? this.getReal({ prop: 'collapsed' }) : false
        }
      },
      {
        prop: 'expanded',
        get () {
          return this.realCollapsed
            ? []
            : this.getReal({ prop: 'expanded' }) || []
        }
      }
    ])
  ],
  props: {
    collapsible: Boolean,
    collapsed: Boolean,
    expanded: Tree.props.datasource
  },
  data () {
    return {
      localOverlayOptions: {
        position: 'right-start'
      },
      refTarget: null,
      open: false,
      currentOptions: null,
      outsideRefs: ['tree']
    }
  },
  computed: {
    hasIcon () {
      return !!some(this.items, ({ icon }) => !!icon)
    }
  },
  watch: {
    exactActiveItem: {
      handler (value) {
        if (!this.realCollapsed) {
          if (value) {
            this.showActiveItems()
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    itemClass (item) {
      let { name, disabled } = item
      return {
        [this.$c('disabled')]: disabled,
        [this.$c('menu-item-exact-active')]: this.exactActiveItem
          ? this.exactActiveItem.name === name
          : false,
        [this.$c('menu-item-active')]: this.activeItems.some(
          i => i.name === name
        )
      }
    },
    show (props) {
      if (this.realCollapsed) {
        this.open = true
        this.refTarget = `item-${props.name}`
        this.currentOptions = props.options
      }
    },
    close () {
      this.open = false
      this.refTarget = null
    },
    showActiveItems () {
      let names = this.activeItems.map(i => i.name)
      if (names) {
        this.realExpanded = uniq([...this.realExpanded, ...names])
      }
    },
    toggleExpanded ({ name }) {
      let index = this.realExpanded.indexOf(name)
      let expanded
      if (index === -1) {
        expanded = uniq([...this.realExpanded, name])
      } else {
        expanded = [...this.realExpanded]
        expanded.splice(index, 1)
      }
      this.realExpanded = expanded
    },
    toggleCollapsed () {
      this.realCollapsed = !this.realCollapsed
    },
    postNormalize (item) {
      if (item.children) {
        item.position = 'popup'
        item.options = item.children
      }
      return item
    },
    handleItemClick (item) {
      let { to, children, disabled } = item
      if (disabled) return

      // 1. all tree items: activate or toggleExpanded
      // 2. top items on being collapsed: activate + close dropdown
      // 3. options: activate + close dropdown

      // collapsed 时在可以跳转时也把 popout 给关了
      this.activateItem(item, this.realCollapsed)
      // tree + 不能跳转 + 有 children 则 toggle children
      if (!this.realCollapsed && !to && children && children.length) {
        this.toggleExpanded(item)
      }

      this.$emit('click', item)
    }
  }
}
</script>

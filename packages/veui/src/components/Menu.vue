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
      :datasource="realItems"
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
          @click.stop="handleItemClick(link)"
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
          >
            <slot
              name="item-label"
              v-bind="link"
            >
              <veui-link
                :class="$c('menu-link')"
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
              ...itemClass(link)
            }"
          >
            <slot
              name="item-label"
              v-bind="link"
            >
              <veui-link
                :class="$c('menu-link')"
                v-bind="pickLinkProps(link)"
                @click="handleSelect(link.name, link.closeMenu)"
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
import Vue from 'vue'
import Tree from './Tree'
import Icon from './Icon'
import Link from './Link'
import Button from './Button'
import OptionGroup from './OptionGroup'
import Overlay from './Overlay'
import { map, some, endsWith, uniq, pick, isString } from 'lodash'
import ui from '../mixins/ui'
import prefix from '../mixins/prefix'
import controllable from '../mixins/controllable'
import overlay from '../mixins/overlay'
import outside from '../directives/outside'
import { find } from '../utils/datasource'
import '../common/uiTypes'

const ensureSlash = str => (endsWith(str, '/') ? str : `${str}/`)

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
  uiTypes: ['select'],
  directives: { outside },
  mixins: [
    prefix,
    ui,
    overlay,
    controllable([
      'active',
      {
        prop: 'collapsed',
        get () {
          return this.collapsible ? this.getReal({ prop: 'collapsed' }) : false
        }
      },
      {
        prop: 'expanded',
        get () {
          return this.realCollapsed ? [] : this.getReal({ prop: 'expanded' })
        }
      }
    ])
  ],
  props: {
    active: String,
    matches: {
      type: Function,
      default (route, item) {
        return ensureSlash(route.path) === ensureSlash(item.path)
      }
    },
    collapsible: Boolean,
    collapsed: Boolean,
    items: Tree.props.datasource,
    expanded: Tree.props.datasource
  },
  data () {
    return {
      localExpanded: [],
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
    },
    transformedItems () {
      return Vue.observable(this.transformItems(this.items, null))
    },
    realItems () {
      this.markItems(this.transformedItems)
      return this.transformedItems
    }
  },
  watch: {
    realActive: {
      handler (value) {
        if (!this.realCollapsed) {
          let exactActiveItem = find(this.realItems, item => item.exactActive)
          if (exactActiveItem) {
            this.showItem(exactActiveItem)
          }
        }
      },
      immediate: true
    }
  },
  created () {
    if (this.$router) {
      const updateActive = route => {
        let exactActiveItem = find(this.realItems, item =>
          this.matches(route, item)
        )
        this.realActive = exactActiveItem ? exactActiveItem.name : null
      }
      this.$watch('$route', updateActive)
      // active 受控了，初始当前路由就不同步了
      if (!this.isControlled('active')) {
        updateActive(this.$route)
      }
    }
  },
  methods: {
    // 确保每个item都有name
    transformItems (items) {
      return map(items, item => {
        let { to, name, children } = item
        if (name == null && to == null) {
          throw new Error('name or to required!')
        }

        item = {
          ...item,
          exactActive: false,
          active: false
        }

        if (to == null) {
          item.path = null
        } else if (this.$router) {
          let { path } = this.$router.resolve(to).route
          item.path = path
        } else if (isString(to)) {
          item.path = to
        } else {
          throw new Error(
            '[veui-menu] Non-string `to` cannot be resolved without Vue Router.'
          )
        }

        if (!name) {
          item.name = item.path || ''
        }
        item.value = item.value || item.name

        if (children) {
          children = this.transformItems(children)
          item.position = 'popup'
          item.options = item.children = children
        }
        return item
      })
    },
    markItems (items) {
      items.forEach(item => {
        let exactActive = this.realActive === item.name
        let active = false
        if (item.children) {
          this.markItems(item.children)
          active = item.children.some(
            ({ exactActive, active }) => exactActive || active
          )
        }
        item.active = active
        item.exactActive = exactActive
      })
    },
    itemClass (item) {
      let { active, exactActive, disabled } = item
      return {
        [this.$c('disabled')]: disabled,
        [this.$c('menu-item-exact-active')]: exactActive,
        [this.$c('menu-item-active')]: active
      }
    },
    pickLinkProps (data) {
      return pick(data, Object.keys(Link.props))
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
    // 保证该 item 的父级是展开的
    showItem (item) {
      let names = getParentNames(item, this.realItems)
      if (names) {
        this.localExpanded = uniq([...this.realExpanded, ...names])
        this.$emit('update:expanded', this.localExpanded)
      }
    },
    toggleExpanded ({ name }) {
      let index = this.realExpanded.indexOf(name)
      if (index === -1) {
        this.localExpanded = uniq([...this.realExpanded, name])
      } else {
        this.localExpanded = [...this.realExpanded]
        this.localExpanded.splice(index, 1)
      }
      this.$emit('update:expanded', this.localExpanded)
    },
    toggleCollapsed () {
      this.realCollapsed = !this.realCollapsed
    },
    handleItemClick (item) {
      let { name, to, children, disabled } = item
      if (disabled) {
        return
      }

      if (to) {
        this.realActive = name
        this.$emit('activate', name)
        this.showItem(item)
      } else if (children && children.length) {
        this.toggleExpanded(item)
      }
      this.$emit('click', item)
    },
    handleSelect (name, closeMenu) {
      let item = find(this.realItems, item => item.name === name)
      if (item.to) {
        this.realActive = name
        this.$emit('activate', name)
        this.close()
        // TODO closeMenu 应该是 optionGroup 自己调
        closeMenu && closeMenu()
      }
      this.$emit('click', item)
    }
  }
}

function getParentNames (item, items, _parent) {
  let names = null
  items.some(i => {
    let { name, children } = i
    let got = name === item.name
    if (got) {
      names = _parent ? [_parent.name] : null
    } else if (children) {
      got = getParentNames(item, children, i)
      if (got) {
        names = [name, ...got]
      }
    }
    return !!got
  })
  return names
}
</script>

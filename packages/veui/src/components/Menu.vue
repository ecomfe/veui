<template>
<div
  :class="{
    [$c('menu')]: true,
    [$c('menu-collapsed')]: realCollapsed
  }"
  :ui="realUi"
>
  <veui-tree
    ref="tree"
    :class="$c('menu-tree')"
    :datasource="itemInfo.realItems"
    :expanded.sync="realExpanded"
    keys="name"
    @click="handleItemClick"
  >
    <template
      slot="item"
      slot-scope="props"
    >
      <div
        :ref="`item-${props.name}`"
        :class="{
          [$c('menu-item')]: true,
          ...itemClass(props)
        }"
        tabindex="1"
        @mouseenter="show(props)"
      >
        <slot
          name="item"
          v-bind="props"
        >
          <veui-icon
            v-if="props.icon"
            :class="$c('menu-item-icon')"
            :name="props.icon"
          />
          <slot
            name="item-label"
            v-bind="props"
          >
            <veui-link
              :class="{
                [$c('menu-link')]: true,
                [$c('menu-item-label')]: true
              }"
              :disabled="!!props.disabled"
              :to="props.to"
              :ui="realUi"
            >
              <span
                v-if="!realCollapsed"
                :class="$c('menu-item-text')"
              >{{
                props.label
              }}</span>
            </veui-link>
          </slot>
          <button
            v-if="
              !realCollapsed &&
                !props.disabled &&
                props.children &&
                props.children.length
            "
            type="button"
            :ui="uiParts.expand"
            tabindex="-1"
            :class="$c('menu-item-expand-switcher')"
            @click.stop="toggleExpanded(props)"
          >
            <veui-icon :name="icons.expand"/>
          </button>
        </slot>
      </div>
    </template>
  </veui-tree>
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
        slot-scope="props"
      >
        <veui-link
          :ui="realUi"
          :class="{
            ...itemClass(props),
            [$c('menu-link')]: true
          }"
          v-bind="getLinkProps(props)"
        >{{ props.label }}</veui-link>
      </template>
      <template
        slot="option-group-label"
        slot-scope="props"
      >
        <veui-link
          :ui="realUi"
          :class="{
            ...itemClass(props),
            [$c('menu-link')]: true
          }"
          v-bind="getLinkProps(props)"
          @click="handleSelect(props.name, props.closeMenu)"
        >{{ props.label }}</veui-link>
      </template>
    </veui-option-group>
  </veui-overlay>
  <div
    :class="{
      [$c('menu-bottom')]: true,
      [$c('menu-bottom-collapsed')]: localCollapsed
    }"
  >
    <button
      v-if="collapsible"
      :ui="uiParts.collapse"
      :class="$c('menu-bottom-collapse-switcher')"
      @click="toggleCollapsed"
    >
      <veui-icon :name="icons.collapse"/>
    </button>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import Tree from './Tree'
import Icon from './Icon'
import Link from './Link'
import OptionGroup from './OptionGroup'
import Overlay from './Overlay'
import { map, endsWith, startsWith, uniq, pick, isString } from 'lodash'
import ui from '../mixins/ui'
import prefix from '../mixins/prefix'
import controllable from '../mixins/controllable'
import overlay from '../mixins/overlay'
import outside from '../directives/outside'
import 'veui-theme-one-icons/chevron-right'

const ensureSlash = str => (endsWith(str, '/') ? str : `${str}/`)

export default {
  name: 'veui-menu',
  components: {
    'veui-tree': Tree,
    'veui-link': Link,
    'veui-icon': Icon,
    'veui-option-group': OptionGroup,
    'veui-overlay': Overlay
  },
  uiTypes: ['select'],
  directives: { outside },
  mixins: [
    prefix,
    ui,
    overlay,
    controllable({
      active: 'active',
      collapsed: {
        get () {
          return this.collapsible ? this.getReal({ prop: 'collapsed' }) : false
        }
      }
    })
  ],
  props: {
    active: {
      type: String
    },
    matches: {
      type: Function
    },
    collapsible: {
      type: Boolean
    },
    collapsed: Boolean,
    items: Tree.props.datasource,
    expanded: Tree.props.datasource
  },
  data () {
    return {
      localExpanded: [],
      localOverlayOptions: {
        attachment: 'top left',
        targetAttachment: 'top right'
      },
      refTarget: null,
      open: false,
      currentOptions: null,
      outsideRefs: ['tree'],
      // FIXME
      flag: false
    }
  },
  computed: {
    transformedItems () {
      let fullPathMap = {}
      return {
        items: Vue.observable(
          this.transformItems(this.items, null, fullPathMap)
        ),
        fullPathMap
      }
    },
    itemInfo () {
      let exactActiveItem = this.markItems(this.transformedItems.items)
      return Vue.observable({
        realItems: this.transformedItems.items,
        exactActiveItem
      })
    },
    realExpanded: {
      get () {
        // 这里有点恶心了，改完 Tree 在修复吧
        return this.realCollapsed
          ? (this.flag, [])
          : 'expanded' in this.$options.propsData
            ? (this.flag, this.expanded ? [...this.expanded] : [])
            : this.localExpanded
      },
      set (_) {
        // 仅仅在 sync 中用了，直接忽略，让原来的值重新生效，即 Tree 里面点击 toggle 无效
        // FIXME 当 Tree 不再是 watch时, 暂时用 flag 让每次修改之后的原值都是不同的
        this.flag = !this.flag
        this.localExpanded = [...this.realExpanded]
        this.$emit('update:expanded', this.localExpanded)
      }
    },
    // 返回 exactActive/active
    realMatches () {
      return (
        this.matches ||
        (({ name, to }, realActive) => {
          let exactActive = name === realActive
          let active = exactActive
            ? false
            : startsWith(
              to ? ensureSlash(realActive) : realActive,
              to ? ensureSlash(name) : name
            )

          return {
            exactActive,
            active
          }
        })
      )
    }
  },
  created () {
    if (this.$router) {
      const updateActive = ({ fullPath }) => {
        let fullPathMap = this.transformedItems.fullPathMap
        this.realActive = fullPathMap[fullPath] || null
      }
      this.$watch('$route', updateActive)
      // 第一次 prop active 有值，内部就不 sync 了
      if (!('active' in this.$options.propsData)) {
        updateActive(this.$route)
      }
    }

    // 第一次需要初始 this.realActive 之后执行
    this.$watch('itemInfo', {
      handler ({ exactActiveItem }) {
        if (!this.realCollapsed && exactActiveItem && exactActiveItem.parent) {
          this.toggleExpanded(exactActiveItem.parent, true)
        }
      },
      immediate: true
    })
  },
  methods: {
    // 确保每个item都有name
    transformItems (items, parent, fullPathMap) {
      return map(items, item => {
        let { to, name, children } = item
        if (name == null && to == null) {
          throw new Error('name or to required!')
        }

        item = {
          ...item,
          exactActive: false,
          active: false,
          exactActiveWithin: false,
          parent
        }

        // fullPath 是用来跳转的
        if (to == null) {
          item.fullPath = null
        } else if (this.$router) {
          let { fullPath } = this.$router.resolve(to).route
          item.fullPath = fullPath
        } else if (isString(to)) {
          item.fullPath = to
        } else {
          throw new Error('must have router to resolve to')
        }

        if (!name) {
          item.name = item.fullPath || ''
        }
        fullPathMap[item.fullPath] = item.name
        item.value = item.value || item.name

        if (children) {
          children = this.transformItems(children, item, fullPathMap)
          item.position = 'popup'
          item.options = item.children = children
        }
        return item
      })
    },
    markItems (items) {
      let exactActiveItem = null
      items.forEach(item => {
        let { active, exactActive } = this.realMatches(item, this.realActive)
        let exactActiveWithin = false
        if (exactActive) {
          exactActiveItem = item
        }
        if (item.children) {
          let exact = this.markItems(item.children)
          if (exact) {
            exactActiveItem = exact
          }
          exactActiveWithin = item.children.some(
            ({ exactActive, exactActiveWithin }) =>
              exactActive || exactActiveWithin
          )
        }
        item.active = active
        item.exactActive = exactActive
        item.exactActiveWithin = exactActiveWithin
      })

      return exactActiveItem
    },
    itemClass (item) {
      let { active, exactActive, exactActiveWithin, disabled } = item
      return {
        [this.$c('disabled')]: disabled,
        [this.$c('menu-item-exact-active')]: exactActive,
        [this.$c('menu-item-active')]: active,
        [this.$c('menu-item-exact-active-within')]: exactActiveWithin
      }
    },
    getLinkProps (data) {
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
    toggleExpanded (item, ensureExpanded) {
      let index = this.realExpanded.indexOf(item.name)
      if (index === -1 || ensureExpanded) {
        let names = getParentNames(item)
        names.push(item.name)
        this.localExpanded = uniq([...this.localExpanded, ...names])
      } else {
        this.localExpanded = [...this.realExpanded]
        this.localExpanded.splice(index, 1)
      }
      this.$emit('update:expanded', this.localExpanded)
    },
    toggleCollapsed () {
      this.realCollapsed = !this.realCollapsed
    },
    handleItemClick ({ name }) {
      this.realActive = name
      this.$emit('activate', name)
    },
    handleSelect (name, closeMenu) {
      this.realActive = name
      this.$emit('activate', name)
      this.close()
      closeMenu && closeMenu()
    }
  }
}

function getParentNames (item) {
  let names = []
  while (item.parent) {
    names.push(item.parent.name)
    item = item.parent
  }
  return names
}
</script>

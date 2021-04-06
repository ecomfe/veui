<template>
<div
  ref="group"
  :class="{
    [$c('cascader-pane')]: true,
    [$c('cascader-pane-inline')]: inline
  }"
  :ui="realUi"
>
  <div
    v-for="(group, depth) in expandedItems"
    ref="menu"
    :key="depth"
    :class="{
      [$c('cascader-pane-menu')]: true
    }"
  >
    <div
      v-if="$scopedSlots['menu-before']"
      :class="$c('cascader-pane-menu-before')"
    >
      <slot
        name="menu-before"
        v-bind="{
          option: group
        }"
      />
    </div>
    <abstract-tree
      children-key="options"
      :items="group.options"
      :expand="expand"
      :class="$c('cascader-pane-tree')"
      :group-class="$c('cascader-pane-tree')"
    >
      <template
        slot="item"
        slot-scope="{ item: option, parents }"
      >
        <div
          :class="{
            [$c('cascader-pane-option-wrap')]: true,
            [$c('cascader-pane-option-wrap-expanded')]: isExpanded(option),
            [$c('cascader-pane-option-wrap-popout')]: canPopOut(option),
            [$c('cascader-pane-option-wrap-disabled')]: isDisabled(
              option,
              parents,
              group.parents
            ),
            [$c('cascader-pane-option-wrap-selected')]: isSelected(option),
            [$c(
              'cascader-pane-option-wrap-indeterminate'
            )]: option.partialChecked
          }"
          :data-kbd-level="depth + 1"
          :data-kbd-key="getKey(option)"
          :data-kbd-next="canPopOut(option) && isClickTrigger"
          :tabindex="option.disabled ? -1 : 0"
          @click="handleClick(option)"
          @mouseenter="handleExpand(option, depth, 'hover')"
        >
          <slot
            name="option"
            v-bind="{
              ...slotProps,
              option
            }"
          >
            <div
              ref="button"
              :class="{
                [$c('cascader-pane-group-label')]: hasChildren(option),
                [$c('cascader-pane-option')]: true
              }"
              :ui="realUi"
            >
              <veui-checkbox
                v-if="multiple"
                tabindex="-1"
                :checked="option.checked"
                :indeterminate="option.partialChecked"
                :disabled="isDisabled(option, parents, group.parents)"
                @click.native.stop
                @change="handleSelect(option)"
              />
              <div :class="$c('cascader-pane-option-label')">
                <slot
                  name="option-label"
                  v-bind="{
                    ...slotProps,
                    option
                  }"
                >{{ option.label }}</slot>
              </div>
              <template v-if="canPopOut(option)">
                <veui-button
                  v-if="isClickTrigger"
                  ui="icon"
                  :class="$c('cascader-pane-expandable')"
                  :data-kbd-level="depth + 1"
                  :data-kbd-next="true"
                  :data-kbd-key="`${getKey(option)}-expandable`"
                  @click.native.stop
                  @click="handleExpand(option, depth, 'click')"
                >
                  <veui-icon :name="icons.expandable"/>
                </veui-button>
                <veui-icon
                  v-else
                  :class="$c('cascader-pane-expandable')"
                  :name="icons.expandable"
                />
              </template>
            </div>
          </slot>
        </div>
      </template>
    </abstract-tree>
    <div
      v-if="$scopedSlots['menu-after']"
      :class="$c('cascader-pane-menu-after')"
    >
      <slot
        name="menu-after"
        v-bind="{
          option: group
        }"
      />
    </div>
  </div>
</div>
</template>

<script>
import Overlay from '../Overlay'
import Checkbox from '../Checkbox'
import Icon from '../Icon'
import Button from '../Button'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import overlay from '../../mixins/overlay'
import keySelect from '../../mixins/key-select'
import useControllable from '../../mixins/controllable'
import outside from '../../directives/outside'
import '../../common/uiTypes'
import {
  hasChildren as _hasChildren,
  findParents
} from '../../utils/datasource'
import { scrollIntoView } from '../../utils/dom'
import AbstractTree from '../Tree/_AbstractTree'

const CascaderPane = {
  name: 'veui-cascader-pane',
  components: {
    'veui-icon': Icon,
    'veui-overlay': Overlay,
    'veui-checkbox': Checkbox,
    'veui-button': Button,
    AbstractTree
  },
  directives: {
    outside
  },
  mixins: [
    prefix,
    ui,
    overlay,
    keySelect,
    useControllable([
      {
        prop: 'expanded',
        get (val) {
          if (typeof val === 'boolean' || val == null) {
            return null
          }
          return val
        }
      }
    ])
  ],
  props: {
    expandTrigger: {
      type: String,
      default: 'click',
      validator (val) {
        return val == null || ['hover', 'click'].indexOf(val) >= 0
      }
    },
    value: {},
    options: Array,
    disabled: Boolean,
    inline: Boolean,
    multiple: Boolean,
    expanded: {},
    selectLeaves: Boolean
  },
  computed: {
    isClickTrigger () {
      return this.realExpandTrigger === 'click'
    },
    realExpandTrigger () {
      return this.expandTrigger || 'click'
    },
    expandedItemWithParents () {
      if (this.expanded != null && typeof this.expanded !== 'boolean') {
        return (
          findParents(
            this.realOptions,
            item => this.expanded === getKey(item),
            {
              alias: 'options',
              includeSelf: true
            }
          ) || []
        )
      }
      return []
    },
    expandedItems () {
      let items = this.expandedItemWithParents
      items = items
        .map((item, index) => ({
          ...item,
          parents: items.slice(0, index + 1)
        }))
        .filter(this.canPopOut)
      return [
        {
          options: this.realOptions,
          parents: []
        }
      ].concat(items)
    },
    realSelectLeaves () {
      return !this.multiple && this.selectLeaves
    },
    realOptions () {
      return this.options || []
    },
    slotProps () {
      return {
        select: this.handleSelect,
        click: this.handleClick,
        expand: option => {
          if (this.canPopOut(option)) {
            this.updateExpanded(option)
          }
        }
      }
    }
  },
  methods: {
    handleExpand (option, depth, trigger) {
      if (this.realExpandTrigger === trigger) {
        clearTimeout(this.expandTimer)
        if (this.canPopOut(option)) {
          this.updateExpanded(option)
        } else if (trigger === 'hover') {
          // 设置延时：避免鼠标在面板之间斜着移动时遇到不能展开项而过早的关闭下一级的面板
          this.expandTimer = setTimeout(() => {
            this.updateExpanded(depth ? this.expandedItems[depth] : true)
          }, 200)
        } else {
          this.updateExpanded(depth ? this.expandedItems[depth] : true)
        }
      }
    },
    getKey (item) {
      return getKey(item)
    },
    handleSelect (option) {
      this.$emit('select', option)
    },
    handleClick (option) {
      if (option.disabled) {
        return
      }
      // 点击内容区处理：
      // 多选
      if (this.multiple) {
        // 优先展开
        if (this.canPopOut(option) && this.isClickTrigger) {
          this.updateExpanded(option)
        } else {
          this.handleSelect(option)
        }
      } else {
        // 单选 展开和选中没有优先级之分，没有选中区，能选中则选中，能展开也展开
        if (this.canPopOut(option) && this.isClickTrigger) {
          this.updateExpanded(option)
        }
        if (!this.realSelectLeaves || !hasChildren(option)) {
          this.handleSelect(option)
        }
      }
    },
    updateExpanded (option) {
      let key = option
      if (typeof option !== 'boolean') {
        key = getKey(option)
      }
      if (key !== this.realExpanded) {
        this.commit('expanded', key)
      }
    },
    canPopOut (option) {
      return canPopOut(option)
    },
    expand (option) {
      return !this.canPopOut(option)
    },
    hasChildren (options) {
      return hasChildren(options)
    },
    isExpanded (option) {
      return (
        option.value != null &&
        this.expandedItems.some(item => getKey(item) === getKey(option))
      )
    },
    isSelected (option) {
      if (this.multiple) {
        return option.checked
      }
      let selected = this.value
      if (!Array.isArray(selected)) {
        selected = this.value == null ? [] : [this.value]
      }
      return selected.indexOf(option.value) >= 0
    },
    isDisabled (option, parents, panelParents) {
      return (
        !!option.disabled ||
        parents.some(i => !!i.disabled) ||
        panelParents.some(i => !!i.disabled)
      )
    },
    scrollToCurrent () {
      let menus = this.$refs.menu
      if (menus) {
        menus.forEach(menu => {
          let active = menu.querySelector(
            `.${this.$c('cascader-pane-option-wrap-selected')}`
          )
          if (active) {
            scrollIntoView(active, true)
            // eslint-disable-next-line no-cond-assign
          } else if (
            (active = menu.querySelector(
              `.${this.$c('cascader-pane-option-wrap-expanded')}`
            ))
          ) {
            scrollIntoView(active, true)
          }
        })
      }
    }
  }
}

export function canPopOut (option) {
  let { position } = option
  return hasChildren(option) && (position === 'popup' || !position)
}

function hasChildren (option) {
  return _hasChildren(option, 'options')
}

function getKey ({ name, value }) {
  return name != null ? name : value
}

export default CascaderPane
</script>

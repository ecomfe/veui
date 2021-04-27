<template>
<div
  ref="group"
  :class="{
    [$c('cascader-pane')]: true,
    [$c('cascader-pane-inline')]: inline && !realColumnWidth,
    [$c('cascader-pane-custom-width')]: !!realColumnWidth
  }"
  :ui="realUi"
>
  <div
    v-for="(group, depth) in expandedItems"
    ref="menu"
    :key="depth"
    :class="$c('cascader-pane-column-wrap')"
    :style="realColumnWidth ? { width: realColumnWidth } : null"
  >
    <div :class="$c('cascader-pane-column')">
      <div
        v-if="$scopedSlots['column-before']"
        :class="$c('cascader-pane-column-before')"
      >
        <slot
          name="column-before"
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
        v-if="$scopedSlots['column-after']"
        :class="$c('cascader-column-column-after')"
      >
        <slot
          name="column-after"
          v-bind="{
            option: group
          }"
        />
      </div>
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
    columnTrigger: {
      type: String,
      default: 'click',
      validator (val) {
        return ['hover', 'click'].indexOf(val) >= 0
      }
    },
    value: {},
    options: Array,
    disabled: Boolean,
    inline: Boolean,
    multiple: Boolean,
    expanded: {},
    columnWidth: [Number, String],
    selectMode: {
      type: String,
      default: 'any',
      validator (val) {
        return ['leaf-only', 'any'].indexOf(val) >= 0
      }
    }
  },
  computed: {
    isClickTrigger () {
      return this.columnTrigger === 'click'
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
      return !this.multiple && this.selectMode === 'leaf-only'
    },
    realOptions () {
      return this.options || []
    },
    realColumnWidth () {
      if (this.columnWidth && typeof this.columnWidth === 'number') {
        return `${this.columnWidth}px`
      }
      return this.columnWidth
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
      if (this.columnTrigger === trigger) {
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
          if (this.isClickTrigger) {
            // 不能打开也要重置展开到上级
            this.expandTo(option)
          }
          this.handleSelect(option)
        }
      } else {
        // 单选 展开和选中没有优先级之分，没有选中区，能选中则选中，能展开也展开
        let hasCh = hasChildren(option)
        if (this.isClickTrigger) {
          if (this.canPopOut(option)) {
            this.updateExpanded(option)
          } else if (hasCh) {
            // 不能打开也不能关闭：要重置展开到上级
            this.expandTo(option)
          } else {
            // 叶子节点会选中，这里关闭下
            this.commit('expanded', false)
          }
        }
        if (!this.realSelectLeaves || !hasCh) {
          this.handleSelect(option)
        }
      }
    },
    updateExpanded (option) {
      let key = option
      if (typeof option !== 'boolean') {
        key = getKey(option)
      }
      this.commit('expanded', key)
    },
    getPopoutParents (option) {
      let parents =
        findParents(this.realOptions, item => getKey(item) === getKey(option), {
          alias: 'options'
        }) || []
      return parents.filter(i => i.position !== 'inline')
    },
    expandTo (option) {
      let expanded = true
      let parents = this.getPopoutParents(option)
      if (parents && parents.length) {
        expanded = getKey(parents[parents.length - 1]) || true
      }
      this.commit('expanded', expanded)
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
      let length = menus.length - 1
      if (menus) {
        menus.forEach((menu, index) => {
          let isLast = length === index
          // 每个面板滚动到当前项：最后一个面板滚动选中项，其他面板优先滚动到展开项
          let active = menu.querySelector(
            `.${this.$c(
              `cascader-pane-option-wrap-${isLast ? 'selected' : 'expanded'}`
            )}`
          )
          if (active) {
            scrollIntoView(active, true)
            // eslint-disable-next-line no-cond-assign
          } else if (
            (active = menu.querySelector(
              `.${this.$c(
                `cascader-pane-option-wrap-${isLast ? 'expanded' : 'selected'}`
              )}`
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

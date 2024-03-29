<template>
<transition-group
  ref="group"
  tag="div"
  :name="$c('cascader-pane')"
  :class="{
    [$c('cascader-pane')]: true,
    [$c('cascader-pane-inline')]: inline && !realColumnWidth,
    [$c('cascader-pane-custom-width')]: !!realColumnWidth
  }"
  :style="
    realColumnWidth
      ? { '--veui-cascader-pane-custom-width': realColumnWidth }
      : null
  "
  :ui="realUi"
>
  <div
    v-for="(group, depth) in expandedItems"
    ref="menu"
    :key="`g${depth}`"
    :class="$c('cascader-pane-column-wrap')"
    :style="getPaneItemStyle(depth)"
  >
    <div :class="$c('cascader-pane-column')" :ui="realUi">
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
        <template slot="item" slot-scope="{ item: option, parents }">
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
              [$c('cascader-pane-option-wrap-indeterminate')]:
                option.partialChecked
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
                  [$c('cascader-pane-group-label')]:
                    hasChildren(option) || needLoad(option),
                  [$c('cascader-pane-option')]: true
                }"
                :ui="realUi"
              >
                <veui-checkbox
                  v-if="multiple"
                  tabindex="-1"
                  :ui="uiParts.checkbox"
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
                    <veui-loading v-if="isLoading(option)" loading/>
                    <veui-icon v-else :name="icons.expandable"/>
                  </veui-button>
                  <veui-loading v-else-if="isLoading(option)" loading/>
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
        :class="$c('cascader-pane-column-after')"
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
</transition-group>
</template>

<script>
import Checkbox from '../Checkbox'
import Icon from '../Icon'
import Button from '../Button'
import Loading from '../Loading'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import keySelect from '../../mixins/key-select'
import useControllable from '../../mixins/controllable'
import outside from '../../directives/outside'
import '../../common/global'
import {
  hasChildren as _hasChildren,
  findParents
} from '../../utils/datasource'
import { scrollIntoView } from '../../utils/dom'
import AbstractTree from '../Tree/_AbstractTree'

const LoadScope = {
  CHILDREN: 'children',
  DESCENDANTS: 'descendants'
}

export default {
  name: 'veui-cascader-pane',
  components: {
    'veui-icon': Icon,
    'veui-checkbox': Checkbox,
    'veui-button': Button,
    'veui-loading': Loading,
    AbstractTree
  },
  directives: {
    outside
  },
  mixins: [
    prefix,
    ui,
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
    // eslint-disable-next-line vue/require-prop-types
    value: {},
    options: Array,
    disabled: Boolean,
    inline: Boolean,
    multiple: Boolean,
    // eslint-disable-next-line vue/require-prop-types
    expanded: {},
    columnWidth: [Number, String],
    load: Function,
    selectMode: {
      type: String,
      default: 'any',
      validator (val) {
        return ['leaf-only', 'any'].indexOf(val) >= 0
      }
    }
  },
  data () {
    return {
      currentLoadingKey: null,
      loadingMap: {}
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
            (item) => this.expanded === getKey(item),
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
        expand: (option) => {
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
          // 设置延迟：避免鼠标在面板之间斜着移动时遇到不能展开项而过早的关闭下一级的面板
          this.expandTimer = setTimeout(() => {
            // 比如从浙江移动上海（叶子）要关闭之前浙江的子节点
            // 因为延迟原因，要检查下浙江还是打开的（可能在延迟期间触发了 outside 关闭）
            if (this.expandedItems[depth]) {
              this.updateExpanded(depth ? this.expandedItems[depth] : true)
            }
          }, 200)
        } else {
          this.updateExpanded(depth ? this.expandedItems[depth] : true)
        }
      }
    },
    getKey (item) {
      return getKey(item)
    },
    getPaneItemStyle (depth) {
      return {
        zIndex: this.expandedItems.length - depth,
        ...(this.realColumnWidth && { width: this.realColumnWidth })
      }
    },
    handleSelect (option) {
      if (this.needLoad(option, true)) {
        this.startLoad(option, LoadScope.DESCENDANTS)
        return
      } else {
        this.invalidateLoad()
      }

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
    // boolean 表示展开顶层的下拉
    updateExpanded (option) {
      let key = option
      if (typeof option !== 'boolean') {
        key = getKey(option)
        if (this.needLoad(option)) {
          const prevExpanded = this.expanded
          this.startLoad(option, LoadScope.CHILDREN, (data) => {
            // 1. expanded 从外部变化了则异步展开无效
            // 2. TODO option 不在了处理下
            if (data && data.length && prevExpanded === this.expanded) {
              this.commit('expanded', key)
            }
          })
          return
        }
      }
      this.invalidateLoad()
      this.commit('expanded', key)
    },
    getPopoutParents (option) {
      let parents =
        findParents(
          this.realOptions,
          (item) => getKey(item) === getKey(option),
          {
            alias: 'options'
          }
        ) || []
      return parents.filter((i) => i.position !== 'inline')
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
      let { position } = option
      return (
        this.needLoad(option) ||
        (hasChildren(option) && (position === 'popup' || !position))
      )
    },
    expand (option) {
      return !this.canPopOut(option)
    },
    hasChildren (options) {
      return hasChildren(options)
    },
    startLoad (option, scope, callback) {
      const key = getKey(option)
      const { load, loadingMap } = this
      this.currentLoadingKey = key
      if (loadingMap[key]) {
        return loadingMap[key]
      }

      const loading = Promise.resolve(load({ parent: option, scope }))
        .then((data) =>
          callback && this.currentLoadingKey === key
            ? callback(data)
            : undefined
        )
        .finally(() => this.endLoad(key))
      this.$set(loadingMap, key, loading)
      return loading
    },
    endLoad (key) {
      const { currentLoadingKey, loadingMap } = this
      if (loadingMap[key]) {
        this.$delete(loadingMap, key)
      }
      if (currentLoadingKey === key) {
        this.invalidateLoad()
      }
    },
    invalidateLoad () {
      this.currentLoadingKey = null
    },
    // descendant 是否判断后代中需要加载的
    needLoad (option, descendant) {
      const { lazy, containLazy, options, _loaded } = option
      return (
        ((lazy && options == null && !_loaded) ||
          (descendant && containLazy)) &&
        typeof this.load === 'function'
      )
    },
    isExpanded (option) {
      return (
        option.value != null &&
        this.expandedItems.some((item) => getKey(item) === getKey(option))
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
        parents.some((i) => !!i.disabled) ||
        panelParents.some((i) => !!i.disabled)
      )
    },
    isLoading (option) {
      return !!this.loadingMap[getKey(option)]
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

function hasChildren (option) {
  return _hasChildren(option, 'options')
}

function getKey ({ name, value }) {
  return name != null ? name : value
}
</script>

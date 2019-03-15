<template>
<veui-filter-panel
  ref="selected"
  :datasource="showMode === 'flat' ? flattenOptions : datasource"
  :searchable="searchable"
  :filter="realFilter"
  class="veui-transfer-selected-panel"
  :class="{'veui-transfer-selected-flat': showMode === 'flat'}"
  :placeholder="placeholder"
>
  <template slot="head">
    <slot name="head">
      <slot name="title">
        {{ t('@transfer.selected') }}
      </slot>
      <veui-button
        ui="link"
        class="veui-transfer-remove-all"
        :disabled="!isSelectable"
        @click="removeAll"
      >
        {{ t('@transfer.deselectAll') }}
      </veui-button>
    </slot>
  </template>

  <template slot-scope="{ items }">
    <veui-tree
      v-if="showMode === 'tree'"
      :datasource="items"
      :expanded.sync="localExpanded"
      class="veui-transfer-selected-tree"
      @click="remove"
    >
      <template
        slot="item"
        slot-scope="props"
      >
        <slot
          name="item"
          v-bind="props"
        >
          <div
            class="veui-transfer-selected-item"
            :class="{'veui-transfer-selected-item-hidden': props.item.hidden}"
          >
            <!-- 控制展开收起的图标 -->
            <button
              v-if="props.item.children && props.item.children.length"
              class="veui-tree-item-expand-switcher"
              @click.stop="toggle(props.item)"
            >
              <veui-icon
                :name="props.expanded ? icons.collapse : icons.expand"
                :label="t(props.expanded ? '@transfer.collapse' : '@transfer.expand')"
              />
            </button>

            <div class="veui-transfer-item-label">
              <span class="veui-transfer-item-text">
                <slot
                  name="item-label"
                  v-bind="props"
                >
                  {{ props.item.label }}
                </slot>
              </span>

              <veui-icon
                class="veui-transfer-selected-icon-remove"
                :name="icons.remove"
              />
            </div>
          </div>
        </slot>
      </template>
    </veui-tree>
    <ul
      v-else
      class="veui-transfer-selected-flat-items"
    >
      <li
        v-for="(options, index) in items"
        :key="options.items[options.items.length - 1].value"
        class="veui-transfer-selected-flat-item"
        :class="{'veui-transfer-selected-flat-item-hidden': options.hidden}"
        @click="remove(options.items[options.items.length - 1], options.items.slice(0, options.items.length - 1).reverse())"
      >
        <slot
          name="item"
          :items="options.items"
          :index="index"
        >
          <div class="veui-transfer-selected-flat-item-label">
            <template v-for="(opt, i) in options.items">
              <span
                :key="'l-' + opt.value"
                class="veui-transfer-selected-flat-option-label"
              >
                <slot
                  name="item-label"
                  v-bind="opt"
                  :index="index"
                >
                  {{ opt.label }}
                </slot>
              </span>
              <span
                v-if="i < options.items.length - 1"
                :key="'s-' + opt.value"
                class="veui-transfer-selected-flat-option-separator"
              >
                <veui-icon :name="icons.separator"/>
              </span>
            </template>
            <veui-icon
              class="veui-transfer-selected-flat-icon-remove"
              :name="icons.remove"
            />
          </div>
        </slot>
      </li>
    </ul>
  </template>

  <template slot="no-data">
    <slot name="no-data">
      {{ t('@transfer.select') }}
    </slot>
  </template>
</veui-filter-panel>
</template>

<script>
import FilterPanel from '../FilterPanel'
import Icon from '../Icon'
import Button from '../Button'
import Tree from '../Tree'
import i18n from '../../mixins/i18n'
import { get, clone, isEqual } from 'lodash'

export default {
  name: 'veui-selected-panel',
  components: {
    'veui-filter-panel': FilterPanel,
    'veui-icon': Icon,
    'veui-button': Button,
    'veui-tree': Tree
  },
  mixins: [i18n],
  props: {
    datasource: Array,
    showMode: String,
    searchable: Boolean,
    filter: Function,
    placeholder: String,
    isSelectable: Boolean,
    expanded: Array,
    icons: Object
  },
  data () {
    return {
      flattenOptions: [],
      localExpanded: []
    }
  },
  watch: {
    expanded: {
      handler (val, oldVal) {
        if (!isEqual(val, oldVal)) {
          this.localExpanded = clone(this.expanded)
        }
      },
      immediate: true
    },
    localExpanded (val, oldVal) {
      if (!isEqual(val, oldVal)) {
        this.$emit('update:expanded', val)
      }
    },
    datasource: {
      handler (selectedOptions) {
        let walk = (option, path, paths) => {
          if (!option.children || !option.children.length) {
            paths.push([...path, option])
            return
          }

          option.children.forEach(child => {
            walk(child, [...path, option], paths)
          })
        }

        let paths = []
        selectedOptions.forEach(option => {
          let itemPaths = []
          walk(option, [], itemPaths)
          paths.push(...itemPaths)
        })

        paths.forEach((path, index) => {
          let option = get(this.flattenOptions, [index, 'items'])
          if (
            !option ||
            !path.length === option.length ||
            path.some(
              (pathItem, index) => option[index].value !== pathItem.value
            )
          ) {
            this.flattenOptions[index] = { items: path }
          }
        })
        this.flattenOptions.splice(
          paths.length,
          this.flattenOptions.length - paths.length
        )
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    realFilter (keyword, option) {
      let isFlat = this.showMode === 'flat'
      option = isFlat ? option.items[option.items.length - 1] : option
      return this.filter(
        'selected',
        keyword,
        option,
        isFlat ? this.flattenOptions : this.datasource
      )
    },
    toggle (option) {
      let expanded = clone(this.localExpanded)
      let index = expanded.indexOf(option.value)
      if (index > -1) {
        expanded.splice(index, 1)
      } else {
        expanded.push(option.value)
      }
      this.localExpanded = expanded
    },
    removeAll () {
      this.$emit('removeall')
    },
    remove (...args) {
      this.$emit('remove', ...args)
    }
  }
}
</script>

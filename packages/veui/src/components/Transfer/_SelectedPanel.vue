<template>
<veui-filter-panel
  ref="selected"
  :datasource="showMode === 'flat' ? flattenOptions : datasource"
  :searchable="searchable"
  :filter="realFilter"
  class="veui-transfer-selected-panel"
  :class="{ 'veui-transfer-selected-flat': showMode === 'flat' }"
  :placeholder="placeholder"
  :ui="realUi"
>
  <template slot="head">
    <slot name="head">
      <slot name="title">
        {{ t('@transfer.selected') }}
      </slot>
      <veui-button
        ui="text"
        class="veui-transfer-remove-all"
        :disabled="!isSelectable || !datasource.length"
        @click="removeAll"
      >
        {{ t('@transfer.deselectAll') }}
      </veui-button>
    </slot>
  </template>

  <template slot-scope="{ items, keyword }">
    <veui-tree
      v-if="showMode === 'tree'"
      :datasource="items"
      :expanded.sync="expanded"
      class="veui-transfer-selected-tree"
      :disabled="!isSelectable"
      @click="remove"
    >
      <template
        slot="item"
        slot-scope="props"
      >
        <slot
          name="item"
          v-bind="props"
        />
      </template>
      <template
        slot="item-label"
        slot-scope="props"
      >
        <slot
          name="item-label"
          v-bind="{ ...props, keyword }"
        />
      </template>
      <template slot="item-append">
        <veui-button
          class="veui-tree-item-remove"
          :ui="uiParts.remove"
        >
          <veui-icon
            :label="t('@transfer.remove')"
            :name="icons.remove"
          />
        </veui-button>
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
        :class="{ 'veui-transfer-selected-flat-item-hidden': options.hidden }"
        @click="
          remove(
            options.items[options.items.length - 1],
            options.items.slice(0, options.items.length - 1).reverse()
          )
        "
      >
        <slot
          name="item"
          :items="options.items"
          :index="index"
        >
          <div class="veui-transfer-selected-flat-item-label">
            <template v-for="(item, i) in options.items">
              <span
                :key="'l-' + item.value"
                class="veui-transfer-selected-flat-option-label"
              >
                <slot
                  name="item-label"
                  v-bind="{ item, ...item, keyword }"
                  :index="index"
                >
                  {{ item.label }}
                </slot>
              </span>
              <span
                v-if="i < options.items.length - 1"
                :key="'s-' + item.value"
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
import { get } from 'lodash'

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
    ui: String,
    icons: Object,
    uiParts: Object
  },
  data () {
    return {
      flattenOptions: [],
      expanded: []
    }
  },
  watch: {
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
    removeAll () {
      this.$emit('removeall')
    },
    remove (...args) {
      if (!this.isSelectable) {
        return
      }

      this.$emit('remove', ...args)
    }
  }
}
</script>

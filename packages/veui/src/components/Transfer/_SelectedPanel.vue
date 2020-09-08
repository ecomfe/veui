<template>
<veui-filter-panel
  ref="selected"
  :datasource="showMode === 'flat' ? flattenOptions : datasource"
  :searchable="false"
  :class="{
    [$c('transfer-selected-panel')]: true,
    [$c('transfer-selected-flat')]: showMode === 'flat'
  }"
  :placeholder="placeholder"
  :ui="ui"
>
  <template slot="head">
    <slot name="head">
      <slot name="title">
        {{ t('@transfer.selected') }}
      </slot>
      <veui-button
        :ui="uiParts.removeAll"
        :class="$c('transfer-remove-all')"
        :disabled="!isSelectable || !datasource.length"
        @click="removeAll"
      >
        {{ t('@transfer.deselectAll') }}
      </veui-button>
    </slot>
  </template>

  <template slot-scope="{ items, keyword }">
    <veui-tree
      :datasource="items"
      :expanded.sync="expanded"
      :class="$c('transfer-selected-tree')"
      :disabled="!isSelectable"
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
          v-if="showMode === 'tree'"
          name="item-label"
          v-bind="{ ...props, keyword }"
        />
        <template v-else>
          <template v-for="(item, i) in props.path">
            <span
              :key="'l-' + item.value"
              :class="$c('transfer-selected-flat-option-label')"
            >
              <slot
                name="item-label"
                v-bind="{ item, ...item, keyword }"
                :index="i"
              >
                {{ item.label }}
              </slot>
            </span>
            <veui-icon
              v-if="i < props.path.length - 1"
              :key="'s-' + item.value"
              :class="$c('transfer-selected-flat-separator')"
              :name="icons.separator"
            />
          </template>
        </template>
      </template>
      <template
        slot="item-after"
        slot-scope="props"
      >
        <veui-button
          :class="$c('tree-item-remove')"
          :ui="uiParts.remove"
          :disabled="!isSelectable"
          @click="remove(props.item, props.parents)"
        >
          <veui-icon
            :aria-label="t('@transfer.remove')"
            :name="icons.remove"
          />
        </veui-button>
      </template>
    </veui-tree>
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
import prefix from '../../mixins/prefix'
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
  mixins: [prefix, i18n],
  props: {
    datasource: Array,
    showMode: String,
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
          let options = get(this.flattenOptions, [index, 'path'])
          if (
            !options ||
            !path.length === options.length ||
            path.some(
              (pathItem, index) => options[index].value !== pathItem.value
            )
          ) {
            this.flattenOptions[index] = {
              path,
              value: path[path.length - 1].value
            }
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
    removeAll () {
      this.$emit('removeall')
    },
    remove (item, parents) {
      if (this.showMode === 'tree') {
        this.$emit('remove', item, parents.reverse())
      } else {
        // flat 模式下 tree 只有一层，parents 信息来自 item.path
        this.$emit(
          'remove',
          item.path[item.path.length - 1],
          item.path.slice(0, item.path.length - 1).reverse()
        )
      }
    }
  }
}
</script>

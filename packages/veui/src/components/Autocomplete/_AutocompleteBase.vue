<template>
<div
  ref="self"
  :aria-expanded="realExpanded"
  :aria-owns="dropdownId"
>
  <slot
    :open-suggestions="openSuggestions"
    :close-suggestions="closeAndAutoSuggestion"
    :handleKeydown="handleSuggestionKeydown"
    :update-value="inputUpdateValue"
    :value="realValue"
    :datasource="realDatasource"
    name="input"
  />
  <veui-overlay
    ref="overlay"
    target="self"
    :open="realExpanded"
    :options="realOverlayOptions"
    :overlay-class="overlayClass"
    match-width
  >
    <div
      :id="dropdownId"
      ref="box"
    >
      <slot
        :datasource="keyword ? filteredDatasource : realDatasource"
        :keyword="keyword"
        :update-value="suggestionUpdateValue"
        :active-descendant="activeDescendant"
        :value="realValue"
        :expanded="realExpanded"
        name="suggestions"
      />
    </div>
  </veui-overlay>
</div>
</template>

<script>
import dropdown from '../../mixins/dropdown'
import { createKeySelect } from '../../mixins/key-select'
import searchable from '../../mixins/searchable'
import Overlay from '../Overlay'
import { findComponent } from '../../utils/context'
import { isFunction, cloneDeep, uniqueId } from 'lodash'

function findSuggestions (suggestions, value, finder, childrenKey) {
  let target = false
  suggestions.some(item => {
    target = item[childrenKey]
      ? findSuggestions(item[childrenKey], value, finder, childrenKey)
      : finder(item, value)
    return !!target
  })
  return target
}

function createFinder (valueKey) {
  return (item, value) => (item[valueKey] === value ? item : false)
}

export default {
  name: 'veui-autocompletebase',
  components: {
    'veui-overlay': Overlay
  },
  mixins: [
    dropdown,
    createKeySelect({ focus: false }),
    searchable({
      datasourceKey: 'realDatasource',
      childrenKey: vm => vm.childrenKey,
      valueKey: vm => vm.valueKey,
      searchKey: 'label',
      resultKey: 'filteredDatasource'
    })
  ],
  props: {
    datasource: {
      type: Array,
      default () {
        return []
      }
    },
    /* eslint-disable vue/require-prop-types */
    value: {},
    /* eslint-enable vue/require-prop-types */
    valueKey: {
      type: String,
      default: 'value'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    match: Function,
    strict: Boolean
  },
  data () {
    return {
      localValue: '',
      keyword: '',
      activeDescendant: '',
      optionIdPrefix: uniqueId('veui-autocomplete-option-')
    }
  },
  computed: {
    clonedDatasource () {
      return cloneDeep(this.datasource)
    },
    realDatasource () {
      let valueKey = this.valueKey
      let childrenKey = this.childrenKey
      const walk = suggestions => {
        return suggestions.reduce((result, item) => {
          if (typeof item === 'string') {
            item = { [valueKey]: item }
          }
          if (!item.label) {
            item.label = item[valueKey]
          }
          if (item[childrenKey]) {
            item[childrenKey] = walk(item[childrenKey])
          } else {
            item.optionId = `${this.optionIdPrefix}-${item[valueKey]}`
          }
          result.push(item)
          return result
        }, [])
      }
      return walk(this.clonedDatasource)
    },
    realExpanded () {
      let datasource = this.realValue
        ? this.filteredDatasource
        : this.realDatasource
      return this.expanded && !!datasource.length
    },
    realValue () {
      return this.value === undefined ? this.localValue : this.value
    },
    realFinder () {
      return createFinder(this.valueKey)
    }
  },
  methods: {
    inputUpdateValue (val, updateKeyword = true) {
      this.$forceUpdate()
      this.localValue = val
      this.$emit('input', val)
      if (updateKeyword) {
        this.$nextTick(() => {
          this.keyword = this.realValue
        })
      }
    },
    suggestionUpdateValue (val) {
      this.inputUpdateValue(val, false)
      this.$emit('suggest', val)
      this.closeSuggestions()
    },
    findComponentByMethod (name) {
      return findComponent(this, vm => isFunction(vm[name]))
    },
    callComponentMethod (name, ...args) {
      let comp = this.findComponentByMethod(name)
      if (comp) {
        return comp[name](...args)
      }
    },
    focus () {
      return this.callComponentMethod('focus')
    },
    handleSuggestionKeydown (e) {
      let passive = false
      switch (e.key) {
        case 'Esc':
        case 'Escape':
          this.closeSuggestions()
          break
        case 'Up':
        case 'ArrowUp':
        case 'Down':
        case 'ArrowDown':
          this.openSuggestions()
          this.handleKeydown(e)
          let el = this.getCurrentActiveElement()
          if (el) {
            this.activeDescendant = el.id
          }
          return
        case 'Enter':
          let elem = this.getCurrentActiveElement()
          if (elem) {
            elem.click()
          }
          break
        default:
          passive = true
          break
      }
      if (!passive) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    closeSuggestions () {
      if (this.expanded) {
        this.clearFocusClass()
        this.activeDescendant = null
        this.expanded = false
      }
    },
    openSuggestions () {
      if (!this.expanded) {
        this.keyword = this.realValue
        this.expanded = true
      }
    },
    autoSuggest () {
      let match = findSuggestions(
        this.realDatasource,
        this.realValue,
        this.realFinder,
        this.childrenKey
      )
      if (!match) {
        this.suggestionUpdateValue('')
      }
    },
    closeAndAutoSuggestion () {
      if (this.expanded) {
        this.closeSuggestions()
        if (this.realValue && this.strict) {
          this.autoSuggest()
        }
      }
    }
  }
}
</script>

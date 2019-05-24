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
  >
    <div
      :id="dropdownId"
      ref="box"
    >
      <slot
        :datasource="filteredDatasource"
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
import Overlay from '../Overlay'
import { findComponent } from '../../utils/context'
import { isFunction, cloneDeep, get, uniqueId } from 'lodash'

function filterSuggestions (suggestions, value, filter, childrenKey) {
  let groupMatch = false
  suggestions.forEach(
    item => {
      let match = item[childrenKey]
        ? filterSuggestions(item[childrenKey], value, filter, childrenKey)
        : filter(item, value)
      item.range = match && typeof match === 'object' ? match : null
      item.hidden = !match
      groupMatch = !!match
    }
  )
  return groupMatch
}

const genFilter = valueKey => (item, value) => {
  if (!value) {
    return true
  }
  let indexOf = get(item[valueKey], 'indexOf')
  const index = typeof indexOf === 'function' ? indexOf.call(item[valueKey], value) : -1
  return index >= 0 ? {
    start: index,
    end: index + value.length
  } : false
}

function findSuggestions (suggestions, value, matcher, childrenKey) {
  let target = false
  suggestions.some(
    item => {
      target = item[childrenKey]
        ? findSuggestions(item[childrenKey], value, matcher, childrenKey)
        : matcher(item, value)
      return !!target
    }
  )
  return target
}

const genMatcher = valueKey => (item, value) => item[valueKey] === value ? item : false

export default {
  name: 'veui-autocompletebase',
  components: {
    'veui-overlay': Overlay
  },
  mixins: [dropdown, createKeySelect({ focus: false })],
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
    filter: Function,
    matcher: Function,
    strict: Boolean
  },
  data () {
    return {
      localValue: '',
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
      let self = this
      function walk (suggestions) {
        return suggestions.reduce((result, item) => {
          if (typeof item === 'string') {
            item = { [valueKey]: item }
          }
          if (item[childrenKey]) {
            item[childrenKey] = walk(item[childrenKey])
          } else {
            item.optionId = `${self.optionIdPrefix}-${item[self.valueKey]}`
          }
          result.push(item)
          return result
        }, [])
      }
      return walk(this.clonedDatasource)
    },
    realExpanded () {
      return this.expanded && this.filteredDatasource.some(({ hidden }) => !hidden)
    },
    filteredDatasource () {
      // 若正在关闭，不要计算过滤了，因为会导致页面闪动
      if (!this.expanded) {
        return this.realDatasource
      }
      // 计算过滤
      filterSuggestions(
        this.realDatasource,
        this.realValue,
        this.realFilter,
        this.childrenKey
      )
      return this.realDatasource
    },
    realValue () {
      return this.value === undefined ? this.localValue : this.value
    },
    realMatcher () {
      return this.matcher || genMatcher(this.valueKey)
    },
    realFilter () {
      return this.filter || genFilter(this.valueKey)
    }
  },
  methods: {
    inputUpdateValue (val) {
      this.$forceUpdate()
      this.localValue = val
      this.$emit('input', val)
    },
    suggestionUpdateValue (val) {
      this.inputUpdateValue(val)
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
        this.expanded = true
      }
    },
    autoSuggest () {
      let match = findSuggestions(
        this.realDatasource,
        this.realValue,
        this.realMatcher,
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

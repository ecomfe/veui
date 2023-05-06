<template>
<div ref="self" :aria-expanded="finalExpanded" :aria-owns="dropdownId">
  <slot
    :open-suggestions="openSuggestions"
    :close-suggestions="closeSuggestions"
    :handle-keydown="handleSuggestionKeydown"
    :update-value="inputUpdateValue"
    :value="realValue"
    :datasource="realDatasource"
    :filtered-datasource="filteredDatasource"
    name="input"
  />
  <veui-overlay
    ref="overlay"
    target="self"
    :open="finalExpanded"
    :overlay-class="overlayClass"
    :overlay-style="overlayStyle"
    :local="realOverlayOptions.local"
    :options="realOverlayOptions"
    :priority="overlayPriority"
    match-width
  >
    <div :id="dropdownId" ref="box">
      <slot
        :datasource="keyword ? filteredDatasource : realDatasource"
        :keyword="keyword"
        :update-value="suggestionUpdateValue"
        :active-descendant="activeDescendant"
        :value="realValue"
        :expanded="finalExpanded"
        name="suggestions"
      />
    </div>
  </veui-overlay>
</div>
</template>

<script>
import dropdown from '../../mixins/dropdown'
import { useKeySelect } from '../../mixins/key-select'
import useSearchable from '../../mixins/searchable'
import Overlay from '../Overlay'
import { findComponent } from '../../utils/context'
import warn from '../../utils/warn'
import { isFunction, cloneDeep, uniqueId } from 'lodash'

function createFinder (valueKey) {
  return (item, value) => (item[valueKey] === value ? item : false)
}

export default {
  name: 'veui-autocomplete-base',
  components: {
    'veui-overlay': Overlay
  },
  mixins: [
    dropdown(),
    useKeySelect({
      expandedKey: 'realExpanded',
      useNativeFocus: false
    }),
    useSearchable({
      datasourceKey: 'realDatasource',
      childrenKey: (vm) => vm.childrenKey,
      valueKey: (vm) => vm.valueKey,
      searchKey: 'label',
      resultKey: 'filteredDatasource',
      exposeProps: true
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
    }
  },
  data () {
    return {
      localValue: '',
      keyword: this.value || '',
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
      const walk = (suggestions) => {
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
    finalExpanded () {
      let datasource = this.realValue
        ? this.filteredDatasource
        : this.realDatasource
      return this.realExpanded && !!(datasource.length || this.keyword)
    },
    realValue () {
      return this.value === undefined ? this.localValue : this.value
    },
    realFinder () {
      return createFinder(this.valueKey)
    }
  },
  watch: {
    realValue (val) {
      if (this.realExpanded) {
        this.keyword = val
      }
    },
    $listeners ({ suggest }) {
      if (suggest) {
        warn(
          '[veui-autocomplete] The `suggest` event is deprecated and will be removed in future versions. Please use the `select` event instead.'
        )
      }
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
      this.$emit('select', val)
      this.closeSuggestions()
    },
    findComponentByMethod (name) {
      return findComponent(this, (vm) => isFunction(vm[name]))
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
          this.$nextTick(() => {
            this.handleKeydown(e)
            let el = this.getCurrentActiveElement()
            if (el) {
              this.activeDescendant = el.id
            }
          })
          return
        case 'Enter': {
          let elem = this.getCurrentActiveElement()
          if (elem) {
            elem.click()
          }
          break
        }
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
      if (this.realExpanded) {
        this.clearFocusSelector()
        this.activeDescendant = null
        this.commit('expanded', false)
      }
    },
    openSuggestions () {
      if (!this.realExpanded) {
        this.keyword = this.realValue
        this.commit('expanded', true)
      }
    }
  }
}
</script>

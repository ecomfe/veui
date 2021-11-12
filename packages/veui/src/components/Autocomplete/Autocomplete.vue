<template>
<veui-autocomplete-base
  ref="base"
  :ui="realUi"
  :class="$c('autocomplete')"
  :overlay-class="
    mergeOverlayClass({
      [$c('autocomplete-suggestions')]: true
    })
  "
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
  aria-haspopup="listbox"
  v-bind="baseProps"
  v-on="baseEvents"
>
  <template
    slot="input"
    slot-scope="props"
  >
    <slot
      name="input"
      v-bind="props"
    >
      <veui-input
        ref="input"
        v-outside:suggestions="props.closeSuggestions"
        autocomplete="off"
        :value="props.value"
        :ui="realUi"
        :readonly="realReadonly"
        :disabled="realDisabled"
        :invalid="realInvalid"
        v-bind="inputProps"
        v-on="inputEvents"
        @blur="props.closeSuggestions"
        @keydown="props.handleKeydown"
        @input="handleTrigger($event, props, 'input')"
        @focus="handleTrigger($event, props, 'focus')"
      />
    </slot>
  </template>
  <template
    slot="suggestions"
    slot-scope="suggestionsProps"
  >
    <slot
      name="suggestions"
      v-bind="suggestionsProps"
    >
      <veui-option-group
        ref="suggestions"
        role="listbox"
        :ui="realUi"
        :aria-activedescendant="suggestionsProps.activeDescendant || false"
        :options="suggestionsProps.datasource"
        :class="$c('autocomplete-suggestion-group')"
        @mousedown.native.prevent
      >
        <template
          slot="option-label"
          slot-scope="props"
        >
          <slot
            name="option-label"
            v-bind="props"
          >
            <veui-search-result
              v-if="!!suggestionsProps.keyword"
              :matches="props.matches"
              :separator="icons.separator"
              :separator-class="$c('autocomplete-search-result-item-separator')"
            />
            <span v-else>{{ props.label }}</span>
          </slot>
        </template>
      </veui-option-group>
    </slot>
  </template>
</veui-autocomplete-base>
</template>

<script>
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import overlay from '../../mixins/overlay'
import { normalizeInt, safeSlice } from '../../utils/helper'
import outside from '../../directives/outside'
import AutocompleteBase from './_AutocompleteBase'
import SearchResult from '../_SearchResult'
import Input from '../Input'
import { includes, pick, omit } from 'lodash'
import OptionGroup from '../Select/OptionGroup'
import '../../common/uiTypes'

const SHARED_PROPS = [
  'placeholder',
  'autofocus',
  'selectOnFocus',
  'composition',
  'clearable',
  'maxlength',
  'getLength',
  'strict',
  'trim'
]

const BASE_EVENTS = [
  'input',
  'suggest',
  'select',
  'toggle'
]

export default {
  name: 'veui-autocomplete',
  uiTypes: ['select'],
  components: {
    'veui-input': Input,
    'veui-autocomplete-base': AutocompleteBase,
    'veui-search-result': SearchResult,
    'veui-option-group': OptionGroup
  },
  directives: { outside },
  mixins: [prefix, ui, input, overlay],
  inheritAttrs: false,
  props: {
    suggestTrigger: {
      type: [String, Array],
      default: 'input'
    },
    childrenKey: {
      type: String,
      default: 'options'
    },
    ...pick(Input.props, SHARED_PROPS)
  },
  computed: {
    inputProps () {
      return pick(this.$props, SHARED_PROPS)
    },
    baseProps () {
      return {
        ...omit(this.$props, [...SHARED_PROPS, 'suggestTrigger']),
        ...this.$attrs
      }
    },
    baseEvents () {
      return pick(this.listenersWithValidations, BASE_EVENTS)
    },
    inputEvents () {
      return omit(this.listenersWithValidations, BASE_EVENTS)
    },
    realTriggers () {
      return [].concat(this.suggestTrigger)
    },
    // strict 且没有定制 getLength，选中建议也遵循 input 的 strict 的行为
    isLimitSimpleLength () {
      return this.getLength == null && this.realMaxlength != null && this.strict
    },
    realMaxlength () {
      return normalizeInt(this.maxlength)
    }
  },
  methods: {
    focus () {
      this.$refs.base.focus()
    },
    handleSelect (value) {
      value = value || ''
      if (this.isLimitSimpleLength && value.length > this.realMaxlength) {
        value = safeSlice(value, this.realMaxlength)
      }
      this.$refs.base.suggestionUpdateValue(value)
    },
    openSuggestionOn (mode) {
      return includes(this.realTriggers, mode)
    },
    handleTrigger (val, props, eventName) {
      if (this.openSuggestionOn(eventName) && !this.realReadonly) {
        props.openSuggestions()
      }
      if (eventName === 'input') {
        props.updateValue(val)
      }
    }
  }
}
</script>

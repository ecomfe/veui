<template>
<veui-autocomplete-base
  ref="base"
  :ui="realUi"
  class="veui-autocomplete"
  :overlay-class="mergeOverlayClass('veui-autocomplete-suggestions')"
  :datasource="datasource"
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
  aria-haspopup="listbox"
  v-bind="baseProps"
  v-on="$listeners"
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
        v-bind="inputProps"
        @blur="props.closeSuggestions"
        @keydown="props.handleKeydown"
        @click="handleTrigger($event, props, 'focus')"
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
        :aria-activedescendant="suggestionsProps.activeDescendant"
        :options="suggestionsProps.datasource"
        class="veui-autocomplete-suggestion-group"
        @mousedown.native.prevent="() => false"
      >
        <template
          slot="option-label"
          slot-scope="{value, range}"
        >
          <template v-if="range && range.end">
            <span
              v-if="range.start"
              class="veui-autocomplete-suggestion-prefix"
            >{{ value.slice(0, range.start) }}</span>
            <mark class="veui-autocomplete-suggestion-matched">{{ value.slice(range.start, range.end) }}</mark>
            <span
              v-if="range.end < value.length"
              class="veui-autocomplete-suggestion-suffix"
            >{{ value.slice(range.end, value.length) }}</span>
          </template>
          <span v-else>{{ value }}</span>
        </template>
      </veui-option-group>
    </slot>
  </template>
</veui-autocomplete-base>
</template>

<script>
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import overlay from '../../mixins/overlay'
import outside from '../../directives/outside'
import AutocompleteBase from './_AutocompleteBase'
import Input from '../Input'
import { includes, pick, omit } from 'lodash'
import OptionGroup from '../Select/OptionGroup'

const SHARED_PROPS = [
  'placeholder',
  'autofocus',
  'selectOnFocus',
  'composition',
  'clearable'
]

export default {
  name: 'veui-autocomplete',
  uiTypes: ['select'],
  components: {
    'veui-input': Input,
    'veui-autocomplete-base': AutocompleteBase,
    'veui-option-group': OptionGroup
  },
  directives: { outside },
  mixins: [ui, input, overlay],
  props: {
    ...AutocompleteBase.props,
    focusClass: {
      type: String,
      default: 'veui-autocomplete-focus'
    },
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
      return omit(this.$props, ['suggestTrigger', ...SHARED_PROPS])
    },
    realTriggers () {
      return [].concat(this.suggestTrigger)
    }
  },
  methods: {
    focus () {
      this.$refs.base.focus()
    },
    handleSelect (value) {
      this.$refs.base.suggestionUpdateValue(value)
    },
    openSuggestionOn (mode) {
      return includes(this.realTriggers, mode)
    },
    handleTrigger (val, props, eventName) {
      if (this.openSuggestionOn(eventName)) {
        props.openSuggestions()
      }
      if (eventName === 'input') {
        props.updateValue(val)
      }
    }
  }
}
</script>

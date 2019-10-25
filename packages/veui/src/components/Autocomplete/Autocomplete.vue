<template>
<veui-autocomplete-base
  ref="base"
  :ui="realUi"
  :class="$c('autocomplete')"
  :overlay-class="mergeOverlayClass($c('autocomplete-suggestions'))"
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
          <template v-if="!!suggestionsProps.keyword">
            <template v-for="({ parts }, idx) in props.matches">
              <template v-for="({ text, matched }, index) in parts">
                <mark
                  v-if="matched"
                  :key="`${idx}-${index}`"
                  :class="$c('option-matched')"
                >{{ text }}</mark>
                <span
                  v-else
                  :key="`${idx}-${index}`"
                >{{ text }}</span>
              </template>
              <span
                v-if="idx < props.matches.length - 1"
                :key="idx"
                :class="$c('autocomplete-suggestion-separator')"
              >&gt;</span>
            </template>
          </template>
          <span v-else>{{ props.label }}</span>
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
  mixins: [prefix, ui, input, overlay],
  props: {
    ...AutocompleteBase.props,
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

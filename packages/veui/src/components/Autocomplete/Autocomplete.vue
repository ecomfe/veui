<template>
<veui-autocompletebase
  ref="base"
  class="veui-autocomplete"
  :overlay-class="mergeOverlayClass('veui-autocomplete-suggestion')"
  :datasource="datasource"
  v-bind="$props"
  v-on="$listeners"
>
  <template
    slot="input"
    slot-scope="props"
  >
    <slot name="input">
      <veui-input
        ref="input"
        v-outside:outsideRefs="props.closeSuggestions"
        autocomplete="off"
        :value="props.value"
        :ui="realUi"
        :readonly="realReadonly"
        :disabled="realDisabled"
        v-bind="inputProps"
        @input="handleTrigger($event, props, 'input')"
        @focus="handleTrigger($event, props, 'focus')"
      />
    </slot>
  </template>
  <template
    slot="suggestions"
    slot-scope="{datasource}"
  >
    <slot name="suggestions">
      <veui-optiongroup
        ref="suggestions"
        :options="datasource"
        class="veui-autocomplete-suggestion-group"
      >
        <template
          slot="option-label"
          slot-scope="{value, range}"
        >
          <template v-if="range && range.end">
            <span
              v-if="range.start"
              class="suggestion-prefix"
            >
              {{ value.slice(0, range.start) }}
            </span>
            <mark class="suggestion-match">{{ value.slice(range.start, range.end) }}</mark>
            <span
              v-if="range.end < value.length"
              class="suggestion-suffix"
            >
              {{ value.slice(range.end, value.length) }}
            </span>
          </template>
          <span v-else>{{ value }}</span>
        </template>
      </veui-optiongroup>
    </slot>
  </template>
</veui-autocompletebase>
</template>

<script>
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import overlay from '../../mixins/overlay'
import outside from '../../directives/outside'
import AutocompleteBase from './_AutocompleteBase'
import Input from '../Input'
import { includes, pick } from 'lodash'
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
    'veui-autocompletebase': AutocompleteBase,
    'veui-optiongroup': OptionGroup
  },
  directives: { outside },
  mixins: [ui, input, overlay],
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

<style lang="less">
.sug-item{
  .match {
    color: #ff6800;
  }
}
</style>


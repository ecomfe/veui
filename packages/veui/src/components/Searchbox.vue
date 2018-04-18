<template>
<div class="veui-searchbox"
  :class="{
    'veui-searchbox-suggestion-expanded': expanded,
    'veui-disabled': realDisabled,
    'veui-readonly': realReadonly
  }"
  :ui="ui"
  @click="handleClickBox"
  ref="self"
  role="searchbox"
>
  <veui-input
    ref="input"
    :name="realName"
    :readonly="realReadonly"
    :disabled="realDisabled"
    v-bind="attrs"
    v-model="localValue"
    @keypress.enter.prevent="search"
    @focus="handleInputFocus"
    autocomplete="off"
    v-outside:input="disallowSuggest"
  >
    <div slot="after" class="veui-searchbox-action"
      ref="search"
      @click.stop="search"
      aria-label="搜索"
      :aria-disabled="realDisabled"
      :aria-readonly="realReadonly"
      aria-haspopup="listbox"
    >
      <button
        type="button"
        class="veui-searchbox-action-icon"
        :readonly="realReadonly"
        :disabled="realDisabled"
      >
        <veui-icon :name="icons.search"/>
      </button>
      <veui-button :ui="ui"
        class="veui-searchbox-action-button"
        :readonly="realReadonly"
        :disabled="realDisabled">搜索</veui-button>
    </div>
  </veui-input>
  <veui-overlay
    target="input"
    :options="realOverlayOptions"
    :open="realExpanded"
    v-if="realExpanded"
    :overlay-class="overlayClass">
    <div class="veui-searchbox-suggestion-overlay"
      ref="box"
      role="listbox"
      :aria-expanded="String(realExpanded)"
      :ui="ui">
      <slot name="suggestions" :suggestions="realSuggestions" :select="selectSuggestion">
        <template v-for="(suggestion, index) in realSuggestions">
          <div class="veui-searchbox-suggestion-item"
            :key="index"
            @click="selectSuggestion(suggestion)">
            <slot name="suggestion" v-bind="suggestion">
              {{ suggestion.label }}
            </slot>
          </div>
        </template>
      </slot>
    </div>
  </veui-overlay>
</div>
</template>

<script>
import input from '../mixins/input'
import dropdown from '../mixins/dropdown'
import overlay from '../mixins/overlay'
import ui from '../mixins/ui'
import Input from './Input'
import Icon from './Icon'
import Overlay from './Overlay'
import Button from './Button'
import { pick, includes } from 'lodash'

export default {
  name: 'veui-searchbox',
  mixins: [ui, input, dropdown, overlay],
  components: {
    'veui-input': Input,
    'veui-icon': Icon,
    'veui-overlay': Overlay,
    'veui-button': Button
  },
  props: {
    suggestions: {
      type: Array,
      default () {
        return []
      }
    },
    replaceOnSelect: {
      type: [Boolean, String],
      default: false
    },
    suggestTrigger: {
      type: String,
      default: 'input',
      validator (val) {
        return includes(['focus', 'input', 'submit'], val)
      }
    },
    ...pick(Input.props,
      'autocomplete',
      'placeholder',
      'value',
      'autofocus',
      'selectOnFocus',
      'composition',
      'clearable'
    )
  },
  data () {
    return {
      localValue: this.value,
      localSuggestions: this.suggestions
    }
  },
  computed: {
    attrs () {
      return pick(this, 'ui', 'autocomplete', 'autofocus', 'selectOnFocus', 'composition', 'clearable', 'placeholder')
    },
    realExpanded () {
      return !!(this.expanded && this.realSuggestions && this.realSuggestions.length)
    },
    valueProperty () {
      return this.replaceOnSelect === false ? '' : (this.replaceOnSelect || 'value')
    },
    realSuggestions () {
      if (!this.localSuggestions) {
        return []
      }
      return this.localSuggestions.map(item => {
        if (typeof item === 'string') {
          return { label: item, value: item }
        }
        return item
      })
    },
    isFocusSuggestMode () {
      return this.suggestTrigger === 'focus'
    },
    isInputSuggestMode () {
      return this.suggestTrigger === 'input'
    },
    isSubmitSuggestMode () {
      return this.suggestTrigger === 'submit'
    }
  },
  watch: {
    value (value) {
      this.localValue = value
    },
    localValue (value) {
      this.$emit('input', value)
      this.handleInput()
      if (this.isFocusSuggestMode || this.isInputSuggestMode) {
        this.$emit('suggest', this.localValue)
      }
    },
    suggestions (value) {
      this.localSuggestions = value
    }
  },
  methods: {
    handleInput () {
      if (this.isFocusSuggestMode || this.isInputSuggestMode) {
        this.allowSuggest()
      }
    },
    handleClickBox () {
      if (!this.realDisabled && !this.realReadonly) {
        this.focus()
      }
    },
    focus () {
      this.$refs.input.focus()
    },
    handleInputFocus () {
      if (this.isFocusSuggestMode) {
        this.allowSuggest()
        this.$emit('suggest', this.localValue)
      }
    },
    selectSuggestion (suggestion) {
      if (this.replaceOnSelect !== false) {
        this.localValue = suggestion[this.valueProperty]
      }
      this.focus()
      this.$emit('select', suggestion)
      // 选择 select 的情况会有可能
      //  触发 localValue 改变 => watcher => handleInput => allowSuggest
      // 所以在下一个 nextTick 强制隐藏 suggest
      this.$nextTick(() => {
        this.disallowSuggest()
      })
    },
    search ($event) {
      this.$emit('search', this.localValue, $event)
      if (this.isSubmitSuggestMode) {
        this.allowSuggest()
        this.$emit('suggest', this.localValue)
      } else if (this.isInputSuggestMode || this.isFocusSuggestMode) {
        this.disallowSuggest()
      }
    },
    activate () { // for label activation
      this.focus()
    },
    disallowSuggest () {
      this.expanded = false
      this.localSuggestions = []
    },
    allowSuggest () {
      this.expanded = true
    }
  }
}
</script>

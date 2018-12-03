<template>
<div
  ref="self"
  class="veui-searchbox"
  :class="{
    'veui-searchbox-suggestion-expanded': expanded,
    'veui-disabled': realDisabled,
    'veui-readonly': realReadonly
  }"
  :ui="realUi"
  @click="handleClickBox"
>
  <veui-input
    ref="input"
    v-model="localValue"
    v-outside:input="disallowSuggest"
    :name="realName"
    :readonly="realReadonly"
    :disabled="realDisabled"
    v-bind="attrs"
    autocomplete="off"
    role="searchbox"
    :aria-haspopup="inputPopup"
    @keypress.enter.prevent="search"
    @focus="handleInputFocus"
  >
    <div
      slot="after"
      ref="search"
      class="veui-searchbox-action"
      @click.stop="search"
    >
      <button
        type="button"
        class="veui-searchbox-action-icon"
        :disabled="realDisabled || realReadonly"
        :aria-haspopup="submitPopup"
      >
        <veui-icon
          :name="icons.search"
          :label="t('search')"
        />
      </button>
      <veui-button
        :ui="uiParts.button"
        class="veui-searchbox-action-button"
        :disabled="realDisabled || realReadonly"
        :aria-haspopup="submitPopup"
      >
        {{ t('search') }}
      </veui-button>
    </div>
  </veui-input>
  <veui-overlay
    v-if="realExpanded"
    ref="overlay"
    target="input"
    :options="realOverlayOptions"
    :open="realExpanded"
    :overlay-class="overlayClass"
  >
    <div
      ref="box"
      class="veui-searchbox-suggestion-overlay"
      role="listbox"
      :aria-expanded="String(realExpanded)"
    >
      <slot
        name="suggestions"
        :suggestions="realSuggestions"
        :select="selectSuggestion"
      >
        <template v-for="(suggestion, index) in realSuggestions">
          <div
            :key="index"
            class="veui-searchbox-suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            <slot
              name="suggestion"
              v-bind="suggestion"
            >
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
import i18n from '../mixins/i18n'
import Input from './Input'
import Icon from './Icon'
import Overlay from './Overlay'
import Button from './Button'
import { pick, includes } from 'lodash'

export default {
  name: 'veui-searchbox',
  components: {
    'veui-input': Input,
    'veui-icon': Icon,
    'veui-overlay': Overlay,
    'veui-button': Button
  },
  mixins: [ui, input, dropdown, overlay, i18n],
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
      type: [String, Array],
      default: 'input',
      validator (val) {
        if (!Array.isArray(val)) {
          val = [val]
        }
        return val.every(i => includes(['focus', 'input', 'submit'], i))
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
    suggestTriggers () {
      if (Array.isArray(this.suggestTrigger)) {
        return this.suggestTrigger
      }
      return [this.suggestTrigger]
    },
    hasFocusSuggestMode () {
      return includes(this.suggestTriggers, 'focus')
    },
    hasInputSuggestMode () {
      return includes(this.suggestTriggers, 'input')
    },
    hasSubmitSuggestMode () {
      return includes(this.suggestTriggers, 'submit')
    },
    inputPopup () {
      return (this.hasFocusSuggestMode || this.hasInputSuggestMode) ? 'listbox' : null
    },
    submitPopup () {
      return this.hasSubmitSuggestMode ? 'listbox' : null
    }
  },
  watch: {
    value (val) {
      this.localValue = val
    },
    localValue (val) {
      this.$emit('input', val)
      this.handleInput()
      if (this.hasFocusSuggestMode || this.hasInputSuggestMode) {
        this.$emit('suggest', this.localValue)
      }
    },
    suggestions (val) {
      this.localSuggestions = val
    },
    realSuggestions () {
      if (this.realExpanded) {
        this.$nextTick(() => {
          this.relocate()
        })
      }
    }
  },
  methods: {
    handleInput () {
      if (this.hasFocusSuggestMode || this.hasInputSuggestMode) {
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
      if (this.hasFocusSuggestMode) {
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
      if (this.hasSubmitSuggestMode) {
        this.allowSuggest()
        this.$emit('suggest', this.localValue)
      } else if (this.hasInputSuggestMode || this.hasFocusSuggestMode) {
        this.disallowSuggest()
      }
    },
    activate () { // for label activation
      if (this.realDisabled || this.realReadonly) {
        return
      }
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

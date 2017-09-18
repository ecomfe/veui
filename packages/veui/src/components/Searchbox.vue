<template>
<div class="veui-searchbox"
  :class="{'veui-disabled': realDisabled, 'veui-readonly': realReadonly, 'veui-focus': inputFocus,
    'veui-searchbox-suggestion-expanded': expanded, 'veui-searchbox-clearable': clearable}"
  :ui="ui"
  @click="handleClickBox"
>
  <veui-input
    ref="input"
    :name="realName"
    :readonly="realReadonly"
    :disabled="realDisabled"
    v-bind="attrs"
    v-model="localValue"
    @input="handleInput"
    @focus="inputFocus = true"
    @blur="handleBlur"
    @keyup.enter="search"
  >
  </veui-input>
  <div class="veui-searchbox-others"
    :class="{'veui-searchbox-placeholder-hide': !placeholderShown}">
    <div class="veui-searchbox-placeholder">{{ placeholder }}</div>
    <div class="veui-searchbox-icons">
      <button class="veui-searchbox-icon veui-searchbox-icon-close"
        type="button"
        :readonly="realReadonly"
        :disabled="realDisabled"
        v-if="localValue"
        @click.stop="localValue = ''">
        <icon name="cross-small"></icon>
      </button>
      <button class="veui-searchbox-icon veui-searchbox-icon-search"
        type="button"
        :readonly="realReadonly"
        :disabled="realDisabled"
        @click.stop="search">
        <icon name="search"></icon>
      </button>
    </div>
  </div>
  <veui-overlay
    target="input"
    :options="overlay"
    :open="expanded"
    :overlay-class="overlayClass">
    <div class="veui-searchbox-suggestion-overlay"
      ref="box"
      :ui="ui"
      v-outside:input="close">
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
import { input, dropdown, overlay } from '../mixins'
import { pick } from 'lodash'
import Input from './Input'
import Icon from './Icon'
import Overlay from './Overlay'

export default {
  name: 'veui-searchbox',
  mixins: [input, dropdown, overlay],
  components: {
    'veui-input': Input,
    Icon,
    'veui-overlay': Overlay
  },
  props: {
    ui: String,
    suggestions: {
      type: Array,
      default () {
        return []
      }
    },
    clearable: {
      type: Boolean,
      default: false
    },
    replaceOnSelect: {
      type: [Boolean, String],
      default: false
    },
    ...pick(Input.props,
      'autocomplete',
      'placeholder',
      'value',
      'autofocus',
      'selectOnFocus',
      'composition'
    )
  },
  data () {
    return {
      localValue: this.value,
      // 默认设成false，input focus事件由input控件触发
      inputFocus: false,
      hideSuggestion: true
    }
  },
  computed: {
    attrs () {
      return pick(this, 'ui', 'autocomplete', 'autofocus', 'selectOnFocus', 'composition')
    },
    placeholderShown () {
      // 目前从Input组件上没法感知是否是输入法状态，暂时先focus的时候，隐藏placeholder
      // 等Input组件可以上透这种信息，再优化
      return !this.localValue && !this.inputFocus
    },
    realExpanded () {
      return !!(this.localValue && !this.hideSuggestion && this.realSuggestions && this.realSuggestions.length)
    },
    valueProperty () {
      return this.replaceOnSelect === false ? '' : (this.replaceOnSelect || 'value')
    },
    realSuggestions () {
      if (!this.suggestions) {
        return []
      }
      return this.suggestions.map(item => {
        if (typeof item === 'string') {
          return { label: item, value: item }
        }
        return item
      })
    }
  },
  watch: {
    value (value) {
      this.localValue = value
    },
    realExpanded (value) {
      this.expanded = this.realExpanded
    },
    localValue (value) {
      this.$emit('input', value)
    }
  },
  methods: {
    handleInput () {
      this.hideSuggestion = false
      // 感知输入法情况下处理placeholder逻辑暂时还没有
    },
    handleClickBox () {
      if (!this.realDisabled && !this.realReadonly) {
        this.focus()
      }
    },
    handleBlur () {
      this.inputFocus = false
      // 目前还有一个问题，tab切换时input blur不会引起suggestion的隐藏
    },
    focus () {
      this.$refs.input.focus()
    },
    selectSuggestion (suggestion) {
      this.hideSuggestion = true
      if (this.replaceOnSelect !== false) {
        this.localValue = suggestion[this.valueProperty]
      }
      this.focus()
      this.$emit('select', suggestion)
    },
    search ($event) {
      this.$emit('search', this.localValue, $event)
    },
    activate () { // for label activation
      this.focus()
    },
    close () {
      this.hideSuggestion = true
    }
  }
}
</script>

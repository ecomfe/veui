<template>
<div class="veui-searchbox"
  :class="{'veui-disabled': realDisabled, 'veui-readonly': realReadonly, 'veui-focus': inputFocus,
    'veui-searchbox-suggestion-expanded': expanded, 'veui-searchbox-clearable': clearable}"
  :ui="ui"
  @click="handleClickBox"
  ref="self"
  v-outside:self="outsideSelf"
>
  <veui-input
    ref="input"
    :name="realName"
    :style="{paddingRight: `${inputRightPadding}px`}"
    :readonly="realReadonly"
    :disabled="realDisabled"
    v-bind="attrs"
    v-model="localValue"
    @input="handleInput"
    @focus="inputFocus = true"
    @blur="handleBlur"
    @keypress.enter.prevent="search"
    autocomplete="off"
    v-outside:input="outsideInput"
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
        @click.stop="clear">
        <veui-icon :name="icons.clear"/>
      </button>
      <button class="veui-searchbox-icon veui-searchbox-icon-search"
        ref="search"
        type="button"
        :readonly="realReadonly"
        :disabled="realDisabled"
        @click.stop="search">
        <veui-icon :name="icons.search"/>
        <veui-button :ui="ui"
          :readonly="realReadonly"
          :disabled="realDisabled">搜索</veui-button>
        </button>
    </div>
  </div>
  <veui-overlay
    target="input"
    :options="realOverlayOptions"
    :open="realExpanded"
    v-if="realExpanded"
    :overlay-class="overlayClass">
    <div class="veui-searchbox-suggestion-overlay"
      ref="box"
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
    clearable: {
      type: Boolean,
      default: false
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
      'composition'
    )
  },
  data () {
    return {
      localValue: this.value,
      localSuggestions: this.suggestions,
      // 默认设成false，input focus事件由input控件触发
      inputFocus: false,
      // 该值是为了修复覆盖在input右边的一些按钮的宽度。
      inputRightPadding: 0
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
      this.disallowSuggest()
    },
    search ($event) {
      this.$emit('search', this.localValue, $event)
      if (this.isSubmitSuggestMode) {
        this.allowSuggest()
        this.$emit('suggest', this.localValue)
      }
    },
    clear ($event) {
      this.localValue = ''
    },
    activate () { // for label activation
      this.focus()
    },
    outsideInput () {
      if (this.isInputSuggestMode || this.isFocusSuggestMode) {
        this.disallowSuggest()
      }
    },
    outsideSelf () {
      if (this.isSubmitSuggestMode) {
        this.disallowSuggest()
      }
    },
    disallowSuggest () {
      this.expanded = false
      this.localSuggestions = []
    },
    allowSuggest () {
      this.expanded = true
    }
  },
  mounted () {
    const $search = this.$refs.search
    let fontSize = window.getComputedStyle($search).fontSize
    fontSize = +(fontSize.substring(0, fontSize.length - 2))
    // 各个字段端详细解释一下：
    // fontSize：用来估摸一个clear的icon按钮的宽度
    // 8: css写的clear-icon的右边距
    // -3: 粗略估算 cross-small icon本身的左留白
    this.inputRightPadding = $search.clientWidth + (this.clearable ? (fontSize + 8 - 3) : 0)
  }
}
</script>

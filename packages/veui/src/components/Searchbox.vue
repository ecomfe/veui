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
    :style="{paddingRight: `${inputRightPadding}px`}"
    :readonly="realReadonly"
    :disabled="realDisabled"
    v-bind="attrs"
    v-model="localValue"
    @input="handleInput"
    @focus="inputFocus = true"
    @blur="handleBlur"
    @keyup.enter.prevent="search"
    autocomplete="off"
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
        <icon :name="icons.clear"></icon>
      </button>
      <button class="veui-searchbox-icon veui-searchbox-icon-search"
        ref="search"
        type="button"
        :readonly="realReadonly"
        :disabled="realDisabled"
        @click.stop="search">
        <icon :name="icons.search"></icon>
        <veui-button :ui="ui"
          :readonly="realReadonly"
          :disabled="realDisabled">搜索</veui-button>
        </button>
    </div>
  </div>
  <veui-overlay
    target="input"
    :options="realOverlayOptions"
    :open="expanded"
    v-if="expanded"
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
import { input, dropdown, overlay, icons } from '../mixins'
import { pick } from 'lodash'
import Input from './Input'
import Icon from './Icon'
import Overlay from './Overlay'
import Button from './Button'

export default {
  name: 'veui-searchbox',
  mixins: [input, dropdown, overlay, icons],
  components: {
    'veui-input': Input,
    Icon,
    'veui-overlay': Overlay,
    'veui-button': Button
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
      hideSuggestion: true,
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
      this.expanded = value
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
  },
  mounted () {
    const $search = this.$refs.search
    let fontSize = window.getComputedStyle($search).fontSize
    fontSize = +(fontSize.substring(0, fontSize.length - 2))
    // 各个字段端详细解释一下：
    // fontSize：用来估摸一个clear的icon按钮的宽度
    // 8: css写的clear-icon的右边距
    // -3: 粗略估算 cross-small icon本身的左留白
    // 10: input的左padding
    this.inputRightPadding = $search.clientWidth + 10 + (this.clearable ? (fontSize + 8 - 3) : 0)
  }
}
</script>

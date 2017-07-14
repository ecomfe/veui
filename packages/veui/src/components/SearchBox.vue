<template>
  <div class="veui-search-box"
    :class="[{'veui-disabled': realDisabled, 'veui-readonly': realReadonly, 'veui-search-box-suggestion-expanded': expanded}]"
    :ui="ui"
    @click="_handleClickBox"
  >
    <veui-input
      ref="input"
      :ui="ui"
      :name="realName"
      :readonly="realReadonly"
      :disabled="realDisabled"
      :autofocus="autofocus"
      :selectOnFocus="selectOnFocus"
      :composition="composition"
      v-model="localValue"
      @input="_handleInput"
      @focus="inputFocus = true"
      @blur="_handleBlur"
    >
    </veui-input>
    <div class="veui-search-box-others"
        :class="{'veui-search-box-placeholder-hide': !placeholderShown}">
      <div class="veui-search-box-placeholder">{{ placeholder }}</div>
      <div class="veui-search-box-icons">
        <button class="veui-search-box-icon veui-search-box-icon-cross"
          :readonly="realReadonly"
          :disabled="realDisabled"
          v-if="localValue"
          @click.stop="localValue = ''">
          <icon name="cross-small"></icon>
        </button>
        <button class="veui-search-box-icon veui-search-box-icon-search"
          :readonly="realReadonly"
          :disabled="realDisabled"
          @click.stop="searchText">
          <icon name="search"></icon>
        </button>
      </div>
    </div>
    <veui-overlay
      target="input"
      :options="overlay"
      :open="expanded">
      <div class="veui-search-box-suggestion-overlay"
        ref="box"
        :ui="ui"
        v-outside:input="close">
        <template v-for="(item, index) in suggestions">
          <div class="veui-search-box-suggestion-item"
            :key="index"
            @click="selectSuggestion(item.value)">
            <slot name="item" v-bind="item">
              {{ item.value }}
            </slot>
          </div>
        </template>
      </div>
    </veui-overlay>
  </div>
</template>

<script>
import { input, dropdown } from '../mixins'
import { pick } from 'lodash'
import Input from './Input'
import Icon from './Icon'
import Overlay from './Overlay'

export default {
  name: 'veui-searchbox',
  mixins: [input, dropdown],
  components: {
    'veui-input': Input,
    Icon,
    'veui-overlay': Overlay
  },
  props: {
    ui: String,
    suggestions: Array,
    ...pick(Input.props, [
      'autocomplete',
      'placeholder',
      'value',
      'autofocus',
      'selectOnFocus',
      'composition'
    ])
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
    placeholderShown () {
      // 目前从Input组件上没法感知是否是输入法状态，暂时先focus的时候，隐藏placeholder
      // 等Input组件可以上透这种信息，再优化
      return !this.localValue && !this.inputFocus
    }
  },
  watch: {
    value (newValue) {
      this.localValue = newValue
    },
    hideSuggestion (newValue) {
      this.expanded = !newValue && this.suggestions && this.suggestions.length > 0
    },
    suggestions (newValue) {
      this.expanded = !this.hideSuggestion && newValue && newValue.length > 0
    }
  },
  methods: {
    _handleInput (value, $event) {
      this.hideSuggestion = false
      this.$emit('input', value, $event)
    },
    _handleClickBox () {
      if (!this.realDisabled && !this.realReadonly) {
        this.focusInput()
      }
    },
    _handleBlur () {
      this.inputFocus = false
      // 目前还有一个问题，tab切换时input blur不会引起suggestion的隐藏
    },
    focusInput () {
      this.$refs.input.$el.focus()
    },
    selectSuggestion (text) {
      this.hideSuggestion = true
      this.localValue = text
      this.focusInput()
    },
    searchText ($event) {
      this.$emit('search', this.localValue, $event)
    }
  }
}
</script>


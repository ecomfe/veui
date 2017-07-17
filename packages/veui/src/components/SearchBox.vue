<template>
  <div class="veui-search-box"
    :class="{'veui-disabled': realDisabled, 'veui-readonly': realReadonly, 'veui-focus': inputFocus,
      'veui-search-box-suggestion-expanded': expanded}"
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
    suggestions: {
      type: Array,
      default () {
        return []
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
      return !!this.localValue && !this.hideSuggestion && this.suggestions && this.suggestions.length
    }
  },
  watch: {
    value (value) {
      this.localValue = value
    },
    realExpanded (value) {
      this.expanded = this.realExpanded
    }
  },
  methods: {
    handleInput (value, $event) {
      this.hideSuggestion = false
      this.$emit('input', value, $event)
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
    selectSuggestion (text) {
      this.hideSuggestion = true
      this.localValue = text
      this.focus()
    },
    searchText ($event) {
      this.$emit('search', this.localValue, $event)
    },
    activate () { // for label activation
      this.focus()
    }
  }
}
</script>


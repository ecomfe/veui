<template>
<div
  ref="self"
  :class="{
    [$c('search-box')]: true,
    [$c('search-box-suggestion-expanded')]: realExpanded,
    [$c('disabled')]: realDisabled,
    [$c('readonly')]: realReadonly
  }"
  :ui="realUi"
  @click="handleClickBox"
>
  <veui-input
    ref="input"
    v-model="localValue"
    v-outside:input,box="closeSuggestions"
    :name="realName"
    :readonly="realReadonly"
    :disabled="realDisabled"
    v-bind="attrs"
    autocomplete="off"
    role="search"
    :aria-haspopup="inputPopup"
    :aria-owns="inputPopup ? dropdownId : null"
    @input="keyword = $event"
    @focus="handleInputFocus"
    @keydown="handleInputKeydown"
    @clear="handleClear"
  >
    <div
      slot="after"
      ref="search"
      :class="$c('search-box-action')"
      @click.stop="search"
    >
      <veui-button
        :ui="uiParts.button"
        :class="$c('search-box-action-button')"
        :disabled="realDisabled || realReadonly"
        :aria-haspopup="submitPopup"
      >{{ t('search') }}</veui-button>
    </div>
    <div
      slot="append"
      :class="$c('search-box-action')"
      @click.stop="search"
    >
      <veui-button
        type="button"
        :ui="uiParts.search"
        :class="$c('search-box-action-icon')"
        :disabled="realDisabled || realReadonly"
        :aria-haspopup="submitPopup"
      >
        <veui-icon
          :name="icons.search"
          :label="t('search')"
        />
      </veui-button>
    </div>
  </veui-input>
  <veui-overlay
    v-show="realExpanded"
    ref="overlay"
    target="input"
    match-width
    :open="realExpanded"
    :overlay-class="overlayClass"
    :options="realOverlayOptions"
    :priority="overlayPriority"
  >
    <div
      :id="dropdownId"
      ref="box"
      :class="$c('search-box-suggestion-overlay')"
      role="listbox"
      :ui="realUi"
      :aria-expanded="realExpanded"
    >
      <slot name="suggestions-before"/>
      <slot
        name="suggestions"
        :suggestions="realSuggestions"
        :select="selectSuggestion"
      >
        <veui-option-group
          ref="options"
          :ui="realUi"
          :options="keyword ? filteredSuggestions : realSuggestions"
          :class="$c('search-box-option-group')"
        >
          <template
            v-if="$scopedSlots['group-label']"
            slot="label"
            slot-scope="group"
          >
            <slot
              name="group-label"
              v-bind="group"
            />
          </template>
          <template
            v-if="$scopedSlots['suggestion']"
            slot="option"
            slot-scope="option"
          >
            <slot
              name="suggestion"
              v-bind="option"
            />
          </template>
          <template
            slot="option-label"
            slot-scope="option"
          >
            <slot
              name="option-label"
              v-bind="option"
            >
              <template v-if="!!keyword">
                <template v-for="({ parts }, idx) in option.matches">
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
                    v-if="idx < option.matches.length - 1"
                    :key="idx"
                    :class="$c('option-separator')"
                  >&gt;</span>
                </template>
              </template>
            </slot>
          </template>
        </veui-option-group>
      </slot>
      <slot name="suggestions-after"/>
    </div>
  </veui-overlay>
</div>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import dropdown from '../mixins/dropdown'
import searchable from '../mixins/searchable'
import i18n from '../mixins/i18n'
import Input from './Input'
import Icon from './Icon'
import Overlay from './Overlay'
import Button from './Button'
import OptionGroup from './OptionGroup'
import focusable from '../mixins/focusable'
import { createKeySelect } from '../mixins/key-select'
import { pick, without, includes } from 'lodash'
import '../common/uiTypes'

const SHARED_PROPS = [
  'autocomplete',
  'placeholder',
  'value',
  'autofocus',
  'selectOnFocus',
  'composition',
  'clearable'
]

const keySelect = createKeySelect({ useNativeFocus: false })

export default {
  name: 'veui-search-box',
  uiTypes: ['select'],
  components: {
    'veui-input': Input,
    'veui-icon': Icon,
    'veui-overlay': Overlay,
    'veui-button': Button,
    'veui-option-group': OptionGroup
  },
  mixins: [
    prefix,
    ui,
    input,
    dropdown,
    keySelect,
    focusable,
    searchable({
      datasourceKey: 'realSuggestions',
      childrenKey: 'options',
      keywordKey: 'keyword',
      resultKey: 'filteredSuggestions'
    }),
    i18n
  ],
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
        return []
          .concat(val)
          .every(trigger => includes(['focus', 'input', 'submit'], trigger))
      }
    },
    ...pick(Input.props, SHARED_PROPS)
  },
  data () {
    return {
      localValue: this.value,
      keyword: this.value,
      localSuggestions: this.suggestions
    }
  },
  computed: {
    attrs () {
      return pick(this, ['ui', ...without(SHARED_PROPS, 'value')])
    },
    realExpanded () {
      return !!(
        this.expanded &&
        this.realSuggestions &&
        this.realSuggestions.filter(({ hidden }) => !hidden).length
      )
    },
    valueProperty () {
      if (typeof this.replaceOnSelect !== 'string') {
        return 'value'
      }
      return this.replaceOnSelect
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
      return [].concat(this.suggestTrigger)
    },
    hasFocusTrigger () {
      return includes(this.suggestTriggers, 'focus')
    },
    hasInputTrigger () {
      return includes(this.suggestTriggers, 'input')
    },
    hasSubmitTrigger () {
      return includes(this.suggestTriggers, 'submit')
    },
    inputPopup () {
      return this.hasFocusTrigger || this.hasInputTrigger ? 'listbox' : null
    },
    submitPopup () {
      return this.hasSubmitTrigger ? 'listbox' : null
    }
  },
  watch: {
    value (val) {
      this.localValue = val
      // 因为 selectSuggestion 中关闭用了 nextTick
      this.$nextTick(() => {
        if (this.expanded) {
          this.keyword = val
        }
      })
    },
    localValue (val) {
      this.$emit('input', val)
      this.handleInput()
      if (this.hasFocusTrigger || this.hasInputTrigger) {
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
      if (this.hasFocusTrigger || this.hasInputTrigger) {
        this.openSuggestions()
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
      if (this.hasFocusTrigger && !this.realReadonly) {
        this.openSuggestions()
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
      // 触发 localValue 改变 => watcher => handleInput => openSuggestions
      // 所以在下一个 nextTick 强制隐藏 suggest
      this.$nextTick(() => {
        this.closeSuggestions()
      })
    },
    search ($event) {
      this.$emit('search', this.localValue, $event)
      if (this.hasSubmitTrigger) {
        this.openSuggestions()
        this.$emit('suggest', this.localValue)
      } else if (this.hasInputTrigger || this.hasFocusTrigger) {
        this.closeSuggestions()
      }
    },
    activate () {
      // for label activation
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.focus()
    },
    handleInputKeydown (e) {
      let passive = false
      switch (e.key) {
        case 'Up':
        case 'ArrowUp':
        case 'Down':
        case 'ArrowDown':
          this.openSuggestions()
          if (this.realExpanded) {
            this.$nextTick(() => {
              this.handleKeydown(e)
            })
          } else {
            passive = true
          }
          break
        case 'Enter': {
          if (!this.realExpanded) {
            this.search(e)
            passive = true
            break
          }
          let elem = this.getCurrentActiveElement()
          if (elem) {
            // 会调用 selectSuggestion，所以已经会关闭了
            elem.click()
          }
          break
        }
        case 'Tab':
          passive = true
          this.closeSuggestions()
          break
        default:
          passive = true
      }
      if (!passive) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    handleSelect (value) {
      // find suggestion object recursively according to selected value
      let suggestion = findSuggestion(this.realSuggestions, value)
      this.selectSuggestion(suggestion)
    },
    closeSuggestions () {
      if (this.expanded) {
        this.expanded = false
      }
    },
    openSuggestions () {
      if (!this.expanded) {
        this.keyword = this.localValue
        this.expanded = true
      }
    },
    handleClear () {
      this.$emit('clear')
    }
  }
}

function findSuggestion (suggestions, val) {
  if (!suggestions) {
    return null
  }
  let result = null
  suggestions.some(suggestion => {
    if (!suggestion.options) {
      if (suggestion.value === val) {
        result = suggestion
        return true
      }
    }
    let inner = findSuggestion(suggestion.options, val)
    if (inner !== null) {
      result = inner
      return true
    }
  })
  return result
}
</script>

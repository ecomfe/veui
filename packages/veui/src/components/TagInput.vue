<template>
<veui-input
  ref="input"
  :class="{
    [$c('tag-input')]: true,
    [$c('tag-input-empty')]: empty,
    [$c('tag-input-show-clear')]: showClear
  }"
  v-bind="inputProps"
  v-on="inputEvents"
  @keydown="handleKeydown"
  @blur="appendTag"
  @textwidthchange="handleTextWidthChange"
>
  <template v-if="!empty" #before>
    <veui-tag
      v-for="({ tag, invalid }, i) in tags"
      :key="`#${i}-${tag}`"
      :class="$c('tag-input-tag')"
      :ui="uiParts.tag"
      :type="invalid ? 'error' : undefined"
      :disabled="realDisabled"
      :removable="editable"
      :removed="false"
      tabindex="-1"
      :selectable="editable"
      :selected="false"
      @dblclick="handleEditTag(tag)"
      @remove="handleRemove(tag)"
    >
      {{ tag }}
    </veui-tag>
  </template>
  <template #after>
    <span
      v-if="countLabel"
      :class="{
        [$c('tag-input-tag-count')]: true,
        [$c('tag-input-tag-count-overflow')]: countOverflow
      }"
    >{{ countLabel }}</span>
    <veui-button
      v-if="showClear"
      :class="$c('tag-input-clear')"
      :ui="uiParts.clear"
      :aria-label="t('clear')"
      @click.prevent.stop="clear"
    >
      <veui-icon :name="icons.clear"/>
    </veui-button>
  </template>
  <template v-if="$slots.placeholder" #placeholder>
    <slot name="placeholder"/>
  </template>
</veui-input>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import input from '../mixins/input'
import activatable from '../mixins/activatable'
import useControllable from '../mixins/controllable'
import Tag from './Tag'
import Input from './Input'
import Button from './Button'
import Icon from './Icon'
import { pick, omit, uniq } from 'lodash'

const SHARED_PROPS = ['placeholder', 'clearable', 'maxlength', 'getLength']

const BASE_EVENTS = ['input', 'change']

export default {
  name: 'veui-tag-input',
  components: {
    'veui-tag': Tag,
    'veui-input': Input,
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [
    prefix,
    ui,
    i18n,
    input,
    activatable,
    useControllable([
      {
        prop: 'value',
        event: 'change',
        get (val) {
          if (val == null) {
            return []
          }

          return this.allowDuplicate ? val : uniq(val)
        }
      },
      {
        prop: 'inputValue',
        event: 'input',
        get (val) {
          if (val == null) {
            return ''
          }

          return val
        }
      }
    ])
  ],
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    inputValue: {
      type: String,
      default: ''
    },
    max: Number,
    allowDuplicate: Boolean,
    getLength: Function,
    ...pick(Input.props, SHARED_PROPS)
  },
  computed: {
    tags () {
      return this.realValue.map((tag) => ({
        tag,
        invalid: this.maxlength
          ? this.getValueLength(tag) > this.maxlength
          : false
      }))
    },
    tagLengthOverflow () {
      return this.tags.some(({ invalid }) => invalid)
    },
    empty () {
      return !this.realValue.length
    },
    showClear () {
      return (
        this.clearable && this.editable && (!this.empty || this.realInputValue)
      )
    },
    countLabel () {
      if (this.max) {
        return `${this.realValue.length}/${this.max}`
      }
      return null
    },
    countOverflow () {
      return this.max && this.realValue.length > this.max
    },
    inputProps () {
      return {
        ...pick(this.$props, SHARED_PROPS),
        clearable: false,
        placeholder: this.empty ? this.placeholder : '',
        autocomplete: 'off',
        maxlength: null,
        value: this.realInputValue,
        readonly: this.realReadonly,
        disabled: this.realDisabled,
        invalid:
          this.realInvalid || this.countOverflow || this.tagLengthOverflow,
        ui: this.realUi,
        ...this.$attrs
      }
    },
    inputEvents () {
      return {
        ...omit(this.listenersWithValidations, BASE_EVENTS),
        input: this.handleInput
      }
    },
    editable () {
      return !this.realDisabled && !this.realReadonly
    }
  },
  mounted () {
    this.nativeInput = this.$refs.input && this.$refs.input.$refs.input
  },
  methods: {
    handleTextWidthChange (width) {
      this.nativeInput.style.width = `${width + 1}px`
    },
    getValueLength (value) {
      return typeof this.getLength === 'function'
        ? this.getLength(value)
        : value.length
    },
    mergeValue (val) {
      const { realValue, allowDuplicate } = this

      return allowDuplicate
        ? realValue.concat(val)
        : uniq(realValue.concat(val))
    },
    appendTag () {
      const value = this.realInputValue.trim()

      if (!value) {
        return
      }

      this.commit('value', this.mergeValue(value))
      this.commit('inputValue', '')
    },
    popTag () {
      if (!this.realInputValue && this.realValue.length) {
        this.commit('value', this.realValue.slice(0, -1))
      }
    },
    handleKeydown (e) {
      const { input } = this.$refs

      if (this.realReadonly || this.realDisabled || input.composing) {
        return
      }

      switch (e.key) {
        case 'Backspace': {
          this.popTag()
          break
        }
        case 'Enter': {
          this.appendTag()
          break
        }
        default:
          break
      }
    },
    handleEditTag (tag) {
      if (!this.editable) {
        return
      }

      this.handleRemove(tag)
      this.commit('inputValue', tag)
    },
    focus () {
      if (!this.realDisabled) {
        this.$refs.input.focus()
      }
    },
    activate () {
      this.focus()
    },
    clear () {
      this.commit('value', [])
      this.commit('inputValue', '')
      this.focus()
    },
    handleInput (value) {
      this.commit('inputValue', value)
    },
    handleRemove (tag) {
      this.commit(
        'value',
        this.realValue.filter((item) => item !== tag)
      )
    }
  }
}
</script>

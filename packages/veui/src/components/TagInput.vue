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
    <slot
      v-for="(props, index) in tags"
      name="tag"
      v-bind="{ ...props, index }"
    >
      <veui-tag v-bind="props.attrs" v-on="props.listeners">
        {{ props.tag }}
      </veui-tag>
    </slot>
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
import { useStrict } from '../mixins/strict'
import activatable from '../mixins/activatable'
import useControllable from '../mixins/controllable'
import Tag from './Tag'
import Input from './Input'
import Button from './Button'
import Icon from './Icon'
import { pick, omit, uniq } from 'lodash'

const SHARED_PROPS = ['placeholder', 'clearable', 'getLength']

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
    ]),
    useStrict(['max', 'maxlength'])
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
    maxlength: Number,
    allowDuplicate: Boolean,
    ...pick(Input.props, SHARED_PROPS)
  },
  computed: {
    tags () {
      return this.realValue.map((tag, i) => {
        const invalid = this.maxlength
          ? this.getValueLength(tag) > this.maxlength
          : false

        const edit = () => {
          this.handleEditTag(i)
        }

        const remove = () => {
          this.handleRemove(i)
        }

        return {
          tag,
          invalid,
          readonly: this.realReadonly,
          disabled: this.realDisabled,
          key: `#${i}-${tag}`,
          edit,
          remove,
          attrs: {
            key: `#${i}-${tag}`,
            class: this.$c('tag-input-tag'),
            ui: this.uiParts.tag,
            type: invalid ? 'error' : undefined,
            disabled: this.realDisabled,
            removable: this.editable,
            removed: false,
            tabindex: -1,
            selectable: this.editable,
            selected: false
          },
          listeners: {
            dblclick: edit,
            remove
          }
        }
      })
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
        maxlength: this.realStrict.maxlength ? this.maxlength : null,
        strict: this.realStrict.maxlength,
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
    appendTag () {
      const inputValue = this.realInputValue.trim()

      if (!inputValue) {
        return
      }

      const { realValue, allowDuplicate, max, realStrict } = this

      if (
        (!realStrict.max || max == null || realValue.length < max) &&
        (allowDuplicate || realValue.indexOf(inputValue) === -1)
      ) {
        this.commit('value', realValue.concat(inputValue))
      }

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
    handleEditTag (i) {
      if (!this.editable) {
        return
      }

      const tag = this.realValue[i]
      this.handleRemove(i)
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
    handleRemove (i) {
      if (!this.editable) {
        return
      }

      const newValue = [...this.realValue]
      newValue.splice(i, 1)

      this.commit('value', newValue)
    }
  }
}
</script>

<template>
<div
  ref="taginput"
  class="veui-tag-input"
  :class="{
    'veui-disabled': realDisabled,
    'veui-readonly': realReadonly
  }"
  @click="focus"
>
  <slot
    :value="localValue"
    :closable="canCloseTag"
    :close-tag="removeTag"
    name="before"
  >
    <template v-for="(tag, index) in localValue">
      <veui-tag
        :key="tag"
        ui="tiny"
        :closable="canCloseTag"
        @close="removeTag(tag, index)"
      >
        {{ tag }}
      </veui-tag>
    </template>
  </slot>
  <veui-autocomplete
    ref="autocomplete"
    v-model="inputValue"
    ui="tiny"
    v-bind="autocompleteProps"
    :style="{
      width: inputWidth
    }"
    @suggest="insertTag"
    @enter="handleEnterEvent"
  />
</div>
</template>

<script>
import ui from '../mixins/ui'
import input from '../mixins/input'
import Autocomplete from './Autocomplete/Autocomplete'
import Tag from './Tag'
import { omit, includes } from 'lodash'

export default {
  name: 'veui-tag-input',
  uiTypes: ['select'],
  components: {
    'veui-autocomplete': Autocomplete,
    'veui-tag': Tag
  },
  mixins: [ui, input],
  props: {
    ...Autocomplete.props,
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      localValue: this.value || [],
      inputValue: ''
    }
  },
  computed: {
    canCloseTag () {
      return !this.realReadonly && !this.realDisabled
    },
    inputWidth () {
      let width = (this.inputValue || '').length * 15
      return `${width || 10}px`
    },
    autocompleteProps () {
      return omit(this.$props, ['value'])
    }
  },
  watch: {
    value (val) {
      this.localValue = val || []
    }
  },
  methods: {
    focus () {
      this.$refs.autocomplete.focus()
    },
    removeTag (tag, index) {
      this.localValue.splice(index, 1)
      this.$emit('removetag', tag)
      this.$emit('input', this.localValue)
    },
    insertTag () {
      if (this.inputValue) {
        if (!includes(this.localValue, this.inputValue)) {
          this.localValue.push(this.inputValue)
          this.$emit('input', this.localValue)
        }
        this.inputValue = ''
      }
    },
    handleEnterEvent (matched) {
      if (!matched && !this.strict) {
        this.insertTag()
      }
    }
  }
}
</script>

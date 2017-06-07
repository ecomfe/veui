<template>
  <input
    v-if="type !== 'textarea'"
    class="veui-input"
    v-bind="attrs"
    v-model="localValue"
    @focus="$emit('focus', $event)"
    @click="$emit('click', $event)"
    @blur="$emit('blur', $event)"
    @change="$emit('change', $event.target.value, $event)"
    @input="handleInput"
  >
  <textarea
    v-else
    class="veui-textarea"
    :class="{ 'veui-textarea-resizable': resizable }"
    v-bind="attrs"
    v-model="localValue"
    @focus="$emit('focus', $event)"
    @click="$emit('click', $event)"
    @blur="$emit('blur', $event)"
    @change="$emit('change', $event.target.value, $event)"
    @input="handleInput"></textarea>
</template>

<script>
import { input } from '../mixins'
import { omit, includes } from 'lodash'

const TYPE_LIST = ['text', 'password', 'hidden', 'textarea']

export default {
  name: 'veui-input',
  mixins: [input],
  props: {
    ui: String,
    type: {
      type: String,
      default: 'text',
      validator (val) {
        return includes(TYPE_LIST, val)
      }
    },
    autocomplete: String,
    placeholder: String,
    value: [String, Number],
    autofocus: Boolean,
    selectOnFocus: Boolean,
    composition: Boolean,
    resizable: Boolean,
    fitContent: Boolean
  },
  data () {
    return {
      localValue: this.value
    }
  },
  computed: {
    attrs () {
      return omit(this.$props, ['selectOnFocus', 'fitContent', 'composition', 'resizable'])
    }
  },
  watch: {
    value (newVal) {
      this.localValue = newVal
    }
  },
  methods: {
    handleInput ($event) {
      // 分3种情况
      // 1. 感知输入法，触发原生 input 事件就必须向上继续抛出
      // 2. 不感知输入法
      //  2.1 vue 底层会对原生 input 的 v-model 做忽略输入法组合态处理，所以 localValue 和 $event.target.value 不同步，只有当 localValue 产生变化时才向上继续抛出
      //  2.2 在 localValue 没有变化的情况下，原则上不抛出
      if (this.composition || !this.composition && this.localValue !== this.value) {
        this.$emit('input', $event.target.value, $event)
      }
    },
    focus () {
      this.$el.focus()
    }
  },
  mounted () {
    if (this.type !== 'hidden') {
      if (this.placeholder && !('placeholder' in document.createElement('input'))) {
        // TODO
        // this.$on('focus', handlePlaceHolder)
      }
      if (this.selectOnFocus) {
        this.$on('focus', (e) => e.target.select())
      }
      if (this.fitContent) {
        // TODO
      }
    }
  },
  created () {
    this.$on('labelclick', this.focus)
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-input,
.veui-textarea {
  height: @veui-height-normal;
  width: 300px;
  line-height: 1;
  vertical-align: middle;
  border: 1px solid @veui-theme-color-primary;
  border-radius: 2px;
  border-color: @veui-gray-color-sup-1;
  background-color: #fff;
  font-size: @veui-font-size-normal;
  box-shadow: 0 0.5px 2px 0 rgba(0, 0, 0, 0.1) inset;

  &:hover {
    border-color: @veui-theme-color-primary;
  }

  &:focus {
    border-color: @veui-theme-color-primary;
    .veui-shadow(glow, @veui-theme-color-primary);
    outline: none;
  }

  &[readonly],
  &:disabled {
    background-color: @veui-gray-color-sup-3;
    border-color: @veui-gray-color-sup-1;
    color: @veui-text-color-weak;
    .veui-shadow(none);
  }

  &:disabled {
    cursor: not-allowed;
  }

  &::placeholder {
    color: @veui-gray-color-weak;
  }
}

.veui-input {
  padding: 0 11px;
  &[ui~="large"] {
    height: @veui-height-large;
    font-size: @veui-font-size-large;
  }

  &[ui~="small"] {
    height: @veui-height-small;
    font-size: @veui-font-size-small;
  }
}

.veui-textarea {
  padding: 6.5px 12px;
  line-height: 1.5;
  resize: none;

  &[rows] {
    height: auto;
  }

  &.veui-textarea-resizable {
    resize: both;
  }
}

</style>

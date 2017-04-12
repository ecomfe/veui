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
    @input="_handleInput"
  >
  <textarea
    v-else
    class="veui-textarea"
    v-bind="attrs"
    v-model="localValue"
    @focus="$emit('focus', $event)"
    @click="$emit('click', $event)"
    @blur="$emit('blur', $event)"
    @change="$emit('change', $event.target.value, $event)"
    @input="_handleInput"></textarea>
</template>

<script>
import mixin from '../mixins/input'
import {omit, includes} from 'lodash'

const typeList = ['text', 'password', 'textarea']
const completeTypeList = ['on', 'off']

export default {
  name: 'veui-input',
  mixins: [mixin],
  props: {
    ui: String,
    type: {
      type: String,
      default: 'text',
      validator (value) {
        return includes(typeList, value)
      }
    },
    autocomplete: {
      type: String,
      default: 'off',
      validator (value) {
        return includes(completeTypeList, value)
      }
    },
    placeholder: String,
    value: [String, Number],
    autofocus: Boolean,
    autoselect: Boolean,
    composition: Boolean,
    resize: Boolean,
    autosize: Boolean
  },
  data () {
    return {
      localValue: this.value
    }
  },
  computed: {
    attrs () {
      let omitItems = ['autoselect', 'composition']
      let attrs = omit(this.$props, omitItems)
      return attrs
    }
  },
  watch: {
    value (newVal) {
      this.localValue = newVal
    }
  },
  methods: {
    _handleInput ($event) {
      if (this.composition || !this.composition && this.localValue !== this.value) {
        this.$emit('input', $event.target.value, $event)
      }
    }
  },
  mounted () {
    if (this.placeholder && !('placeholder' in document.createElement('input'))) {
      // TODO
      // this.$on('focus', handlePlaceHolder)
    }
    if (this.autoselect) {
      this.$on('focus', (e) => e.target.select())
    }
    if (this.autosize) {
      // TODO
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-input,
.veui-textarea {
  height: @veui-height-normal;
  width: 250px;
  line-height: 1;
  vertical-align: middle;
  border: 1px solid @veui-theme-color-primary;
  border-radius: 2px;
  border-color: @veui-gray-color-sup-1;
  background-color: #fff;
  font-size: @veui-font-size-normal;

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
  padding: 10px 12px;
  resize: none;

  &[resize="true"] {
    resize: both;
  }
}

</style>

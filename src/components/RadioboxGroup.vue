<template>
  <div class="veui-radioboxgroup">
    <radiobox
      :ui="ui"
      :name="localName"
      v-for="(item, index) in items"
      :key="index"
      :value="item.value"
      :disabled="item.disabled || disabled"
      :checked="item.value === value"
      @change="checked => handleChange(item.value, checked)">
      <slot v-bind="item">{{ item.label }}</slot>
    </radiobox>
  </div>
</template>

<script>
import { input } from '../mixins'
import Radiobox from './Radiobox'
import { uniqueId } from 'lodash'

export default {
  name: 'veui-boxgroup',
  components: {
    'radiobox': Radiobox
  },
  mixins: [input],
  model: {
    event: 'change'
  },
  props: {
    ui: String,
    items: Array,
    value: null
  },
  computed: {
    localName () {
      return this.name || uniqueId('veui-radioboxgroup-')
    }
  },
  methods: {
    handleChange (value, checked) {
      if (checked) {
        this.$emit('change', value)
      }
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-radioboxgroup {
  height: @veui-height-normal;
  line-height: @veui-height-normal - 1;

  &[ui~="small"] {
    height: @veui-height-small;
    line-height: @veui-height-small - 1;
  }

  &[ui~="large"] {
    height: @veui-height-large;
    line-height: @veui-height-large - 1;
  }
}
</style>

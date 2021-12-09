<template>
<veui-field
  ref="field"
  :ui="realUi"
  :class="{
    [$c('fieldset')]: true,
    [$c('fieldset-required')]: required,
    [$c('fieldset-vertical')]: vertical
  }"
  role="group"
  v-bind="attrs"
>
  <template slot="label"><slot name="label"/></template>
  <slot/>
  <template slot="tip"><slot name="tip"/></template>
</veui-field>
</template>

<script>
/**
 * fieldset 和 field 的区别是 fieldset 只能用来做 ui 上的排列和显示 tip，合并显示 error
 */
import Field from './Field'
import { omit } from 'lodash'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import '../../common/uiTypes'

export default {
  name: 'veui-fieldset',
  uiTypes: ['fieldset'],
  components: {
    'veui-field': Field
  },
  mixins: [prefix, ui],
  props: {
    label: String,
    name: String,
    tip: String,
    disabled: Boolean,
    readonly: Boolean,
    // 因为会出现一行里边有必填和非必填共存，交给使用者决定显不显示星号
    required: Boolean,
    vertical: Boolean
    // displayError: {
    //   ...Field.props.displayError,
    //   default: 'verbose'
    // }
  },
  computed: {
    attrs () {
      return omit(this.$props, ['required'])
    }
  }
}
</script>

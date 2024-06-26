<template>
<veui-field
  ref="field"
  :ui="realUi"
  :class="{
    [$c('fieldset')]: true,
    [$c('field-required')]: required
  }"
  role="group"
  v-bind="$attrs"
  :required="required"
>
  <template slot="label">
    <slot name="label"/>
  </template>
  <slot/>
  <template slot="tip">
    <slot name="tip"/>
  </template>
</veui-field>
</template>

<script>
/**
 * fieldset 和 field 的区别是 fieldset 只能用来做 ui 上的排列和显示 tip，合并显示 error
 */
import Field from './Field'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import '../../common/global'

export default {
  name: 'veui-fieldset',
  uiTypes: ['fieldset', 'form-container'],
  components: {
    'veui-field': Field
  },
  mixins: [prefix, ui],
  inheritAttrs: false,
  props: {
    // 因为会出现一行里边有必填和非必填共存，交给使用者决定显不显示星号
    required: Boolean
  }
}
</script>

<template>
<div
  :ui="realUi"
  :class="{
    [$c('field')]: true,
    [$c('invalid')]: isInvalid,
    [$c('field-abstract')]: abstract,
    [$c('field-no-label')]: !abstract && !label && !$slots.label,
    [$c('field-required')]: isRequired
  }"
>
  <div
    v-if="(!abstract && label) || $slots.label"
    :class="$c('field-label')"
  >
    <slot name="label">
      <veui-label>{{ label }}</veui-label>
    </slot>
    <div
      v-if="tip || $slots.tip"
      :class="$c('field-tip')"
    >
      <veui-icon
        ref="tip"
        :name="icons.tip"
      />
      <veui-tooltip
        :ui="uiParts.tip"
        target="tip"
        position="top-start"
      >
        <slot name="tip">{{ tip }}</slot>
      </veui-tooltip>
    </div>
  </div>
  <div :class="$c('field-main')">
    <div :class="$c('field-content')">
      <slot
        :listeners="interactiveListeners"
        :invalid="isInvalid"
        :validities="realValidities"
        :readonly="realReadonly"
        :disabled="realDisabled"
      />
    </div>
    <div
      v-if="!abstract && msgValidities.length"
      :class="$c('field-error')"
    >
      <div
        v-for="({ message }, index) in msgValidities"
        :key="index"
        :class="$c('field-error-item')"
        :title="message"
      >
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Label from '../Label'
import type from '../../managers/type'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import { get, last } from 'lodash'
import { getTypedAncestorTracker } from '../../utils/helper'
import { getVnodes } from '../../utils/context'
import Icon from '../Icon'
import Tooltip from '../Tooltip'
import Vue from 'vue'
import '../../common/uiTypes'
import useValidation from './_useValidation'

/**
 * 多个规则同时校验会根据规则的优先级进行排序，显示优先级最高的错误。
 * 但是如果中间有交互式的检查，交互顺序会打破优先级的排序。
 * 比如配置了 input 和 change 时校验两个不同级别的规则，
 * 输入了两种规则都不匹配的值：
 * 1. 会在输入过程显示 input 指定的错误消息；
 * 2. 失去焦点显示 change 指定的错误消息；
 * 3. 提交时显示级别高的那个错误消息；
 * 4. 单次交互校验内部多规则遵从优先级排序
 *
 */
const { computed: formField } = getTypedAncestorTracker('form-field')

export default {
  name: 'veui-field',
  uiTypes: ['form-field', 'form-container'],
  components: {
    'veui-icon': Icon,
    'veui-label': Label,
    'veui-tooltip': Tooltip
  },
  mixins: [
    prefix,
    ui,
    useValidation({
      getFieldName () {
        return this.realName
      },
      getFieldValue () {
        return this.getFieldValue()
      }
    })
  ],
  props: {
    label: String,
    name: String,
    tip: String,
    disabled: Boolean,
    readonly: Boolean,
    abstract: Boolean, // 无label（无margin），不展示错误信息
    withholdValidity: Boolean, // 不自动invalid，不自动listener，不自动得到validity
    // displayError: {
    //   type: String,
    //   default: 'first',
    //   validator (val) {
    //     // todo tooltip
    //     return ['first', 'bubble', 'verbose', 'tooltip'].indexOf(val) >= 0
    //   }
    // },
    field: String // form data 上的 path
  },
  computed: {
    realName () {
      return this.name || this.field
    },
    realField () {
      return this.field || this.name
    },
    isInvalid () {
      return !this.validity.valid
    },
    isRequired () {
      return (
        this.realRules &&
        this.realRules.some(perRule => perRule.name === 'required')
      )
    },
    realDisabled () {
      let { disabled, formField, form } = this
      return (
        disabled ||
        (formField && formField.realDisabled) ||
        (form && form.disabled)
      )
    },
    realReadonly () {
      let { readonly, formField, form } = this
      return (
        readonly ||
        (formField && formField.realDeadonly) ||
        (form && form.readonly)
      )
    },
    isFieldset () {
      const uiTypes = getVnodes(this)[0].context.$options.uiTypes || []
      return uiTypes.indexOf('fieldset') >= 0
    },
    ...formField
  },
  created () {
    if (this.realField) {
      this.initialData = type.clone(this.getFieldValue())
    }
  },
  methods: {
    getFieldValue () {
      return get(this.form.data, this.realField)
    },
    resetValue () {
      if (!this.realField) {
        return
      }

      let path = this.realField.split('.')
      let name = last(path)
      let parentPath
      let match = /(\w+)\[(\d+)\]/.exec(name)
      if (match && match[1]) {
        parentPath = [...path.slice(0, -1), match[1]]
        name = match[2]
      } else {
        parentPath = path.slice(0, -1)
      }

      let parentValue = parentPath.length
        ? get(this.form.data, parentPath.join('.'))
        : this.form.data
      Vue.set(parentValue, name, type.clone(this.initialData))
    }
  }
}
</script>

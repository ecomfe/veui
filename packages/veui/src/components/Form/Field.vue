<template>
<div
  :ui="realUi"
  :class="{
    [$c('field')]: true,
    [$c('invalid')]: isInvalid,
    [$c('field-no-label')]: !label && !$slots.label,
    [$c('field-required')]: isRequired
  }"
>
  <div
    v-if="label || $slots.label"
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
      <slot/>
    </div>
    <div
      v-if="!isBubble && msgValidities.length"
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
import { useValidationConsumer } from './_ValidationContext'
import useValidation from './_useValidation'

const { computed: fieldset } = getTypedAncestorTracker('fieldset')

export default {
  name: 'veui-field',
  uiTypes: ['form-field', 'form-container', 'form-validatable'],
  components: {
    'veui-icon': Icon,
    'veui-label': Label,
    'veui-tooltip': Tooltip
  },
  mixins: [
    prefix,
    ui,
    useValidationConsumer('validation'),
    useValidation({
      getName () {
        return this.name || this.field
      },
      getFieldValue () {
        return get(this.form.data, this.realField)
      },
      getRuleValidities () {
        return this.validation.getRuleValidities(this.realName)
      },
      updateRuleValidities (val, ruleNames) {
        if (ruleNames) {
          this.validation.replaceRuleValidities(this.realName, ruleNames, val)
        } else if (val) {
          this.validation.updateRuleValidities(this.realName, val)
        } else {
          this.validation.removeRuleValidities(this.realName)
        }
      }
    })
  ],
  props: {
    label: String,
    name: String,
    tip: String,
    disabled: Boolean,
    readonly: Boolean,
    displayError: {
      type: String,
      validator (val) {
        // todo tooltip
        return [null, 'bubble', 'verbose', 'tooltip'].indexOf(val) >= 0
      }
    },
    field: String // form data 上的 path
  },
  data () {
    return {
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
      validators: []
    }
  },
  computed: {
    isBubble () {
      return this.displayError === 'bubble'
    },
    isVerbose () {
      return this.displayError === 'verbose'
    },
    validityNames () {
      const names = [].concat(
        this.realName || [],
        this.validators.map(i => i.name).filter(Boolean)
      )
      if (this.isFieldset) {
        return this.fieldset.items.reduce((acc, field) => {
          return field.isBubble ? acc.concat(field.validityNames) : acc
        }, names)
      }
      return names
    },
    realValidities () {
      return this.validityNames.reduce((acc, name) => {
        return acc.concat(this.validation.realValidities[name] || [])
      }, [])
    },
    isInvalid () {
      return !!this.realValidities.length
    },
    msgValidities () {
      const msg = this.realValidities.filter(({ message }) => !!message)
      return this.isVerbose ? msg : msg.slice(0, 1)
    },
    validity () {
      const validity = this.realValidities[0]
      return {
        ...(validity || {}),
        valid: !validity
      }
    },
    isRequired () {
      return (
        this.realRules &&
        this.realRules.some(perRule => perRule.name === 'required')
      )
    },
    realDisabled () {
      let { disabled, fieldset, form } = this
      return (
        disabled || (fieldset && fieldset.disabled) || (form && form.disabled)
      )
    },
    realReadonly () {
      let { readonly, fieldset, form } = this
      return (
        readonly || (fieldset && fieldset.readonly) || (form && form.readonly)
      )
    },
    realField () {
      return this.field || this.name
    },
    isFieldset () {
      const uiTypes = getVnodes(this)[0].context.$options.uiTypes || []
      return uiTypes.indexOf('fieldset') >= 0
    },
    ...fieldset
  },
  created () {
    if (this.realField) {
      this.initialData = type.clone(this.getFieldValue())
      this.form.fields.push(this)
    }
    if (this.realName && !this.isFieldset && this.fieldset) {
      this.fieldset.items.push(this)
    }
  },
  beforeDestroy () {
    if (this.realField) {
      this.form.fields.splice(this.form.fields.indexOf(this), 1)
    }
    if (this.realName && !this.isFieldset && this.fieldset) {
      this.fieldset.items.splice(this.fieldset.items.indexOf(this), 1)
    }
    // 销毁校验结果在 useValidation 中。
  },
  methods: {
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

<template>
<div
  :ui="realUi"
  :class="{
    'veui-field': true,
    'veui-field-invalid': !validity.valid,
    'veui-field-no-label': !label && !$slots.label,
    'veui-field-no-tip': !tip && !$slots.tip,
    'veui-field-required': isRequired
  }"
>
  <div
    v-if="label || $slots.label"
    class="veui-form-label"
  >
    <slot name="label">
      <veui-label>{{ label }}</veui-label>
    </slot>
  </div>
  <slot/>
  <div
    v-if="tip || $slots.tip"
    class="veui-form-tip"
  >
    <slot name="tip">
      {{ tip }}
    </slot>
  </div>
  <div
    v-if="!validity.valid && !!validity.message"
    class="veui-field-error"
    :title="validity.message"
  >
    <veui-icon :name="icons.alert"/>{{ validity.message }}
  </div>
</div>
</template>

<script>
import Label from '../Label'
import type from '../../managers/type'
import rule from '../../managers/rule'
import ui from '../../mixins/ui'
import { isBoolean, get, last, includes } from 'lodash'
import { getTypedAncestorTracker } from '../../utils/helper'
import Icon from '../Icon'
import Vue from 'vue'
import '../../common/uiTypes'

const { computed: form } = getTypedAncestorTracker('form')
const { computed: fieldset } = getTypedAncestorTracker('fieldset')

export default {
  name: 'veui-field',
  uiTypes: ['field', 'form-container'],
  components: {
    'veui-icon': Icon,
    'veui-label': Label
  },
  mixins: [ui],
  props: {
    label: String,
    name: String,
    tip: String,
    disabled: Boolean,
    readonly: Boolean,
    rules: [String, Array],
    field: String
  },
  data () {
    return {
      inputs: [],
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
       * fields 复数命名主要是兼容 validator 的多 field 错误显示
       *
       * @type {Array<fields, message, valid>}
       */
      validities: [],
      initialData: null
    }
  },
  computed: {
    validity () {
      return (
        this.validities[0] || {
          valid: true
        }
      )
    },
    realRules () {
      if (!this.rules) {
        return null
      }

      let rules
      if (Array.isArray(this.rules)) {
        rules = type.clone(this.rules)
      } else {
        rules = this.rules
          .trim()
          .split(/\s+/)
          .map(perRule => ({
            name: perRule,
            value: true
          }))
      }
      rule.initRules(rules)
      return rules
    },
    isRequired () {
      return (
        this.realRules &&
        this.realRules.some(perRule => perRule.name === 'required')
      )
    },
    interactiveRulesMap () {
      let map = {}
      if (this.realRules) {
        this.realRules.forEach(({ triggers, name, message, value }) => {
          if (!triggers) {
            return
          }

          triggers = triggers.split(',')
          triggers.forEach(eventName => {
            if (eventName === 'submit') {
              return
            }

            let item = {
              value,
              name,
              message
            }
            if (map[eventName]) {
              map[eventName].push(item)
            } else {
              map[eventName] = [item]
            }
          })
        })
      }
      return map
    },
    realDisabled () {
      let { disabled, fieldset, form } = this
      return (
        disabled ||
        (fieldset && fieldset.realDisabled) ||
        (form && form.disabled)
      )
    },
    realReadonly () {
      let { readonly, fieldset, form } = this
      return (
        readonly ||
        (fieldset && fieldset.realReadonly) ||
        (form && form.readonly)
      )
    },
    realField () {
      return this.field || this.name
    },
    ...form,
    ...fieldset
  },
  created () {
    this.form.fields.push(this)
    // 如果是 fieldset 或者没写 field，初始值和校验都没有意义
    if (!this.realField) {
      return
    }

    this.initialData = type.clone(this.getFieldValue())
    this.$on('interact', this.handleInteract)
  },
  beforeDestroy () {
    if (!this.realField) {
      return
    }

    this.form.fields.splice(this.form.fields.indexOf(this), 1)
  },
  methods: {
    getFieldValue () {
      return get(this.form.data, this.realField)
    },
    resetValue () {
      // 清空错误消息，为什么要先做，因为有可能是个fieldset，可以清错误，但是没有值
      this.validities = []

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
    },
    validate (rules) {
      let res = rule.validate(
        this.getFieldValue(),
        rules || this.realRules,
        this.form.data
      )
      // 分两种调用
      // 1. 交互式，只清涉及的 rule
      // 2. 完整提交检查，全清
      this.hideValidity(rules ? rules.map(rule => `native:${rule.name}`) : [])

      if (!isBoolean(res) || !res) {
        this.validities.unshift(
          // 去掉一些自定义格式不对的 rule，容易排查
          ...res
            .filter(({ name }) => name)
            .map(({ message, name }) => ({
              valid: false,
              message,
              fields: `native:${name}`
            }))
        )
      }
      return res
    },
    handleInteract (eventName) {
      // 需要让对应的 data 更新完值之后，再去 validate，都要 nextTick 来保证
      if (this.interactiveRulesMap[eventName]) {
        this.$nextTick(() => this.validate(this.interactiveRulesMap[eventName]))
      }

      if (this.name) {
        this.$nextTick(() => this.form.$emit('interact', eventName, this.name))
      }
    },
    hideValidity (fields) {
      if (!fields || !fields.length) {
        this.validities = []
      } else {
        let validities = this.validities
        // 提供一个仅清除本地检查的方法
        if (fields === 'native:*') {
          validities = this.validities.filter(
            validity => !includes(validity.fields, 'native:')
          )
        } else {
          validities = this.validities.filter(validity =>
            Array.isArray(fields)
              ? !includes(fields, validity.fields)
              : fields !== validity.fields
          )
        }
        this.$set(this, 'validities', validities)
      }
    }
  }
}
</script>

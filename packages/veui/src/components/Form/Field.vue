<template>
<div
  :ui="realUi"
  :class="{
    [$c('field')]: true,
    [$c('invalid')]: invalid,
    [$c('field-abstract')]: realAbstract,
    [$c('field-no-label')]: !realAbstract && !label && !$slots.label,
    [$c('field-required')]: isRequired
  }"
>
  <div
    v-if="(!realAbstract && label) || $slots.label"
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
        :invalid="invalid"
        :validities="validities"
        :readonly="realReadonly"
        :disabled="realDisabled"
      />
    </div>
    <div
      v-if="!realAbstract"
      :class="$c('field-message-wrapper')"
    >
      <veui-loading
        v-if="validating"
        :loading="validating"
      >{{
        t('validating')
      }}</veui-loading>
      <veui-field-messages
        v-else-if="validationStatus !== 'success'"
        :messages="renderableValidities"
      />
    </div>
  </div>
</div>
</template>

<script>
import Label from '../Label'
import Loading from '../Loading'
import type from '../../managers/type'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import i18n from '../../mixins/i18n'
import { pull, get, last, find, uniq } from 'lodash'
import { getVnodes } from '../../utils/context'
import { getTypedAncestor } from '../../utils/helper'
import Icon from '../Icon'
import Tooltip from '../Tooltip'
import Vue from 'vue'
import '../../common/global'
import { useCoupled, useFacade } from './_facade'
import useRule from './_useRule'
import FieldMessages from './_FieldMessages'
import { asFormChild } from './Form'
import { ValidityType, normalizeValidities } from './_useValidity'

const { asParent: asFieldParent, asChild: asFieldChild } =
  useCoupled('form-field')

export { asFieldChild }

const { ERROR, WARNING, SUCCESS } = ValidityType

export default {
  name: 'veui-field',
  uiTypes: ['form-field', 'form-container'],
  components: {
    'veui-icon': Icon,
    'veui-label': Label,
    'veui-tooltip': Tooltip,
    'veui-loading': Loading,
    'veui-field-messages': FieldMessages
  },
  mixins: [
    prefix,
    ui,
    i18n,
    // 直接用 decorator 在方法上标更好？
    useFacade((vm) => ({
      isDisabled: () => (vm.withholdValidity ? false : vm.realDisabled),
      isReadonly: () => (vm.withholdValidity ? false : vm.realReadonly),
      isInvalid: (input) => (vm.isPassThrough(input) ? vm.invalid : false),
      getInteractiveListeners: (input) =>
        vm.isPassThrough(input) ? vm.interactiveListeners : {},
      isFieldset: () => vm.isFieldset,
      isAbstract: () => vm.realAbstract,
      getAbstractFieldNames: () => vm.abstractFieldNames,
      getName: () => vm.realName,
      getField: () => vm.realField,
      getFieldValue: vm.getFieldValue,
      resetValue: vm.resetValue,
      validate: vm.validate,
      updateIntrinsicValidities: vm.updateIntrinsicValidities,
      // this 和 parentField 之间没有 input 即返回 true, 调用方保证 parentField 和 vm 的父子关系
      isDirectSubField: (parentField) =>
        !getTypedAncestor(vm, 'input', parentField),
      addInput (input) {
        vm.inputs.push(input)
        return () => pull(vm.inputs, input)
      },
      addField (field) {
        vm.fields.push(field)
        return () => pull(vm.fields, field)
      }
    })),
    asFieldParent((vm) => vm.getFacade()),
    asFormChild('form', (vm) => vm.form.addField(vm.getFacade())),
    asFieldChild('parentField', (vm) =>
      vm.parentField.addField(vm.getFacade())
    ),
    useRule('rule', {
      getRules: (vm) => vm.rules,
      getFieldValue: (vm) => vm.getFieldValue()
    })
  ],
  props: {
    label: String,
    name: String,
    tip: String,
    disabled: Boolean,
    readonly: Boolean,
    rules: [String, Array],
    field: String,
    abstract: Boolean, // 无label（无margin），不展示错误信息
    withholdValidity: Boolean // 不自动invalid，不自动listener，不自动 disabled 和 readonly
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
      initialData: null,
      fields: []
    }
  },
  computed: {
    realDisabled () {
      return (
        this.disabled ||
        (!!this.parentField && this.parentField.isDisabled()) ||
        (!!this.form && this.form.isDisabled())
      )
    },
    realReadonly () {
      return (
        this.readonly ||
        (!!this.parentField && this.parentField.isReadonly()) ||
        (!!this.form && this.form.isReadonly())
      )
    },
    validating () {
      return this.form.isValidating(this.validityKeys)
    },
    primaryInput () {
      const { inputs, realName } = this
      let primary
      if (inputs.length !== 1) {
        primary = find(inputs, (input) => input.getDeclaredName() === realName)
      }

      return primary || inputs[0]
    },
    isFieldset () {
      const uiTypes = getVnodes(this)[0].context.$options.uiTypes || []
      return uiTypes.indexOf('fieldset') >= 0
    },
    inFieldset () {
      return this.parentField ? this.parentField.isFieldset() : false
    },
    hasDirectSubField () {
      return this.fields.some((field) => field.isDirectSubField(this))
    },
    // 不自动和 input 联动，当 Field 下面直接嵌套 Field 那么所有自动绑定都会取消
    realWithhold () {
      return this.withholdValidity || this.isFieldset || this.hasDirectSubField
    },
    validities () {
      return this.form ? this.form.getValiditiesOfFields(this.validityKeys) : []
    },
    validityKeys () {
      return this.realAbstract
        ? this.realName
          ? [this.realName]
          : []
        : this.abstractFieldNames
    },
    abstractFieldNames () {
      return this.fields.reduce(
        (acc, ch) => {
          return ch.isAbstract() ? acc.concat(ch.getAbstractFieldNames()) : acc
        },
        this.realName ? [this.realName] : []
      )
    },
    renderableValidities () {
      return this.validities.filter(
        ({ message, render }) => !!message || !!render
      )
    },
    invalid () {
      return !this.validating && !!this.errors.length
    },
    errors () {
      return this.validities.filter((va) => va.type === ERROR)
    },
    validationStatus () {
      let result = SUCCESS
      this.validities.some(({ type }) => {
        const isError = type === ERROR
        if (isError || type === WARNING) {
          result = type
        }
        return isError
      })
      return result
    },
    realAbstract () {
      return this.abstract || this.inFieldset
    },
    isRequired () {
      return this.rule.getRules().some((perRule) => perRule.name === 'required')
    },
    interactiveListeners () {
      let allEvents = []
      const { form, realName, rule, handleInteract } = this
      if (form) {
        let events = form.getInteractiveEvents()[realName]
        if (events) {
          allEvents = allEvents.concat(events)
        }
      }
      allEvents = allEvents.concat(Object.keys(rule.getInteractiveRuleRecord()))
      return uniq(allEvents).reduce((acc, eventName) => {
        acc[eventName] = () => handleInteract(eventName)
        return acc
      }, {})
    },
    realField () {
      return this.field || this.name
    },
    realName () {
      return this.name || this.field
    }
  },
  created () {
    // 如果是 fieldset 或者没写 field，初始值和校验都没有意义
    if (!this.realField) {
      return
    }

    this.initialData = type.clone(this.getFieldValue())
  },
  methods: {
    getFieldValue () {
      this.assertForm()
      return get(this.form.getFormData(), this.realField)
    },
    assertForm () {
      const { form } = this
      if (!form) {
        throw new Error('veui fields should be used in a form scope.')
      }
    },
    isPassThrough (input) {
      const fieldsetLike = this.isFieldset || this.hasDirectSubField
      return (
        !this.withholdValidity &&
        !fieldsetLike &&
        input &&
        input === this.primaryInput
      )
    },
    updateIntrinsicValidities (validities) {
      this.assertForm()
      this.form.updateIntrinsicValidities(
        this.realName,
        normalizeValidities(validities)
      )
    },
    validate (rules) {
      if (this.isFieldset) {
        return
      }

      this.assertForm()
      const { form, realName, primaryInput, rule } = this
      const result = rule.validate(form.getFormData(), rules)

      const ruleNames = rules ? rules.map((rule) => rule.name) : null
      form.updateRuleValidities(realName, ruleNames, result)

      // 整体都校验时，输入组件的内置校验也校验下
      if (
        !rules &&
        primaryInput &&
        typeof primaryInput.validate === 'function'
      ) {
        const inputResult = normalizeValidities(primaryInput.validate())
        if (inputResult !== true) {
          return (result === true ? [] : result).concat(inputResult)
        }
      }
      return result
    },
    handleInteract (eventName) {
      // 需要让对应的 data 更新完值之后，再去 validate，都要 nextTick 来保证
      this.$nextTick(() => {
        this.assertForm()

        const { form, rule } = this
        const rules = rule.getInteractiveRuleRecord()[eventName]
        let result = rules ? this.validate(rules) : {}
        result = result === true ? {} : result

        form.validateForEvent(eventName, this.realName, result)
      })
    },
    // @deprecrated
    resetValue () {
      if (!this.realField) {
        return
      }

      this.assertForm()
      // 清空错误消息，为什么要先做，因为有可能是个fieldset，可以清错误，但是没有值
      if (this.realName) {
        this.form.clearValiditiesOfField(this.realName)
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
        ? get(this.form.getFormData(), parentPath.join('.'))
        : this.form.getFormData()
      Vue.set(parentValue, name, type.clone(this.initialData))
    }
  }
}
</script>

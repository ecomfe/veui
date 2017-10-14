<template>
<div :ui="ui" class="veui-field" :class="{'veui-field-invalid': !validity.valid, 'veui-field-no-label': !label, 'veui-field-no-tip': !tip, 'veui-field-required': isRequired}">
  <span v-if="label || $slots.label" class="veui-form-label">
    <slot name="label"><veui-label>{{ label }}</veui-label></slot>
  </span>
  <slot></slot>
  <span v-if="tip || $slots.tip" class="veui-form-tip"><slot name="tip">{{ tip }}</slot></span>
  <p v-if="!validity.valid && !!validity.message" class="veui-field-error" :title="validity.message"><veui-icon :name="icons.alert"></veui-icon>{{ validity.message }}</p>
</div>
</template>

<script>
import Label from '../Label'
import { type, rule } from '../../managers'
import { icons } from '../../mixins'
import { isBoolean, get, last, includes } from 'lodash'
import { getTypedAncestorTracker } from '../../utils/helper'
import Icon from '../Icon'
import Vue from 'vue'

const { computed: form } = getTypedAncestorTracker('form')
const { computed: fieldset } = getTypedAncestorTracker('fieldset')

export default {
  name: 'veui-field',
  uiTypes: ['field', 'form-container'],
  mixins: [icons],
  components: {
    'veui-icon': Icon,
    'veui-label': Label
  },
  props: {
    ui: String,
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
      validities: [],
      handlers: {},
      initialData: null
    }
  },
  computed: {
    validity () {
      return this.validities[0] || {
        valid: true
      }
    },
    localRules () {
      if (!this.rules) {
        return null
      }

      let rules
      if (Array.isArray(this.rules)) {
        rules = type.clone(this.rules)
        rule.initRules(rules)
      } else {
        rules = this.rules.trim().split(/\s+/).map(perRule => ({
          name: perRule,
          value: true
        }))
        rule.initRules(rules)
      }
      return rules
    },
    isRequired () {
      return this.localRules && this.localRules.some(perRule => perRule.name === 'required')
    },
    interactiveRulesMap () {
      let map = {}
      if (this.localRules) {
        this.localRules.forEach(({ triggers, name, message, value }) => {
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
      let {disabled, fieldset, form} = this
      return disabled || (fieldset && fieldset.realDisabled) || (form && form.disabled)
    },
    realReadonly () {
      let {readonly, fieldset, form} = this
      return readonly || (fieldset && fieldset.realReadonly) || (form && form.readonly)
    },
    ...form,
    ...fieldset
  },
  methods: {
    getFieldValue () {
      return get(this.form.data, this.field)
    },
    resetValue () {
      // 清空错误消息，为什么要先做，因为有可能是个fieldset，可以清错误，但是没有值
      this.validities = []

      if (!this.field) {
        return
      }

      let path = this.field.split('.')
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
    validate (rules = this.localRules) {
      let res = rule.validate(this.getFieldValue(), rules)
      // 把之前同类型的清掉
      this.hideValidity('native:*')
      // 如果有新的错，放进去，这样可以更新错误消息
      if (!isBoolean(res) || !res) {
        res.forEach(({message, name}) => {
          if (name) {
            this.validities.unshift({
              valid: false,
              message,
              fields: `native:${name}`
            })
          }
        })
      }
      return res
    },
    handleInteract (eventName) {
      if (this.interactiveRulesMap[eventName]) {
        this.validate(this.interactiveRulesMap[eventName])
      }
      this.name && this.form.$emit('interact', eventName, this.name)
    },
    hideValidity (fields) {
      if (!fields) {
        this.validities = []
      } else {
        let validities = this.validities
        if (fields === 'native:*') {
          validities = this.validities.filter(validity => !includes(validity.fields, 'native:'))
        } else {
          validities = this.validities.filter(validity => Array.isArray(fields)
            ? !includes(fields, validity)
            : validity.fields !== fields
          )
        }
        this.$set(this, 'validities', validities)
      }
    }
  },
  created () {
    this.form.fields.push(this)
    // 如果是 fieldset 或者没写 field，初始值和校验都没有意义
    if (!this.field) {
      return
    }

    this.initialData = type.clone(this.getFieldValue())
    this.$on('interact', this.handleInteract)
  },
  beforeDestroy () {
    if (!this.field) {
      return
    }

    this.form.fields.splice(this.form.fields.indexOf(this), 1)
  }
}
</script>

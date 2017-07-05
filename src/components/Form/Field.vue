<template>
  <div class="veui-field" :class="{'veui-field-invalid': !validity.valid, 'veui-field-no-key': !label, 'veui-field-no-tip': !tip}">
    <veui-label v-if="label" class="veui-form-key" :label="label" :label-for="labelFor"></veui-label>
    <slot></slot>
    <span v-if="tip" class="veui-form-tip">{{ tip }}</span>
    <p v-if="!validity.valid && !!validity.message" class="veui-field-error" :title="validity.message"><veui-icon name="exclamation-circle"></veui-icon>{{ validity.message }}</p>
  </div>
</template>

<script>
import Label from '../Label'
import { type, rule } from '../../managers'
import { isBoolean, assign, get, last } from 'lodash'
import { getTypedAncestorTracker } from '../../utils/helper'
import Icon from '../Icon'
import '../../icons'
import Vue from 'vue'
const { computed: form } = getTypedAncestorTracker('form')

export default {
  name: 'veui-field',
  uiTypes: ['field', 'form-container'],
  components: {
    'veui-icon': Icon,
    'veui-label': Label
  },
  props: {
    label: String,
    labelFor: String,
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
  computed: assign({
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
    interactiveRulesMap () {
      let map = {}
      this.localRules && this.localRules.forEach(({ triggers, name, message, value }) => {
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
      return map
    },
    realDisabled () {
      return this.disabled || (this.fieldSet && this.fieldSet.realDisabled)
    },
    realReadonly () {
      return this.readonly || (this.fieldSet && this.fieldSet.realReadonly)
    }
  }, form),
  methods: {
    getFieldValue () {
      return get(this.form.data, this.field)
    },
    resetValue () {
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
      if (isBoolean(res) && res) {
        this.hideValidity('local')
      } else {
        this.validities.unshift({
          valid: false,
          message: res,
          invalidType: 'local'
        })
      }
      return res
    },
    handleInteract (eventName) {
      if (this.interactiveRulesMap[eventName]) {
        this.validate(this.interactiveRulesMap[eventName])
      }
      this.name && this.form.$emit('interacting', eventName, this.name)
    },
    hideValidity (invalidType) {
      this.$set(this, 'validities', this.validities.filter(validity => validity.invalidType !== invalidType))
    }
  },
  created () {
    this.form.fields.push(this)
    // 如果是 fieldSet 或者没写field，初始值和校验都没有意义
    if (!this.field) {
      return
    }

    this.initialData = type.clone(this.getFieldValue())
    this.$on('interacting', this.handleInteract)
  },
  beforeDestroy () {
    if (!this.field) {
      return
    }

    this.form.fields.splice(this.form.fields.indexOf(this), 1)
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-field {
  vertical-align: top;
  margin-bottom: @veui-field-gap;
  clear: both;

  &:last-of-type {
    margin-bottom: 0;
  }

  .veui-form-key {
    display: inline-block;
    height: @veui-height-normal;
    width: @veui-form-key-width;
    line-height: @veui-height-normal;
  }

  &-no-key::before {
    content: "";
    display: inline-block;
    width: @veui-form-key-width;
  }

  .veui-span {
    display: inline-block;
  }

  & > [class*="veui"]:not([class*="veui-form-key"]):not([class*="veui-span"]):not([class*="error"]) {
    display: inline-block;
    vertical-align: top;
  }

  & .veui-checkbox {
    line-height: @veui-height-normal;
  }

  &-invalid {
    .veui-input,
    .veui-textarea,
    .veui-select .veui-button,
    .veui-datepicker .veui-button {
      border-color: @veui-alert-color-primary;

      &:hover {
        border-color: @veui-alert-color-primary;
        .veui-shadow(glow, @veui-alert-color-primary);
      }

      &:focus {
        border-color: @veui-alert-color-primary;
        .veui-shadow(glow, @veui-alert-color-primary);
      }
    }
  }

  &-error {
    position: static;
    display: inline-block;
    height: @veui-height-normal;
    line-height: @veui-height-normal;
    margin: 0 0 0 10px;
    vertical-align: top;
    color: @veui-alert-color-primary;

    svg {
      vertical-align: -2px;
      margin-right: 7px;
    }
  }

  .veui-form-tip + .veui-field-error {
    position: absolute;
    display: block;
    margin: 0;
    height: @veui-field-gap;
    line-height: @veui-field-gap;
  }

  .veui-form-key ~ .veui-form-tip + .veui-field-error {
    margin-left: @veui-form-key-width;
  }

  .veui-form-tip {
    display: inline-block;
    line-height: @veui-height-normal;
    margin-left: 10px;
    color: @veui-text-color-weak;
  }
}
</style>

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
import { clone, rule } from '../../managers'
import { isBoolean, assign } from 'lodash'
import { getTypedAncestorTracker, getModelProp } from '../../utils/helper'
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
  computed: assign(
    {
      validity () {
        return this.validities[0] || {
          valid: true
        }
      },
      localRules () {
        if (!this.rules) {
          return null
        } else {
          let rules
          if (Array.isArray(this.rules)) {
            rules = clone.exec(this.rules)
            rule.initRules(rules)
          } else {
            rules = this.rules.trim().split(/\s+/).map(perRule => {
              return {
                name: perRule,
                value: true
              }
            })
            rule.initRules(rules)
          }
          return rules
        }
      },
      interactiveRules () {
        return this.localRules
          ? this.localRules.filter(perRule => {
            if (!perRule.triggers) {
              return false
            }

            let triggers = perRule.triggers.split(',')
            // 没有写triggers按submit处理，写了triggers且不只是submit才放进来
            return !!perRule.triggers && !(triggers.length === 1 && triggers[0] === 'submit')
          })
          : []
      },
      realDisabled () {
        return this.disabled || (this.fieldSet && this.fieldSet.realDisabled)
      },
      realReadonly () {
        return this.readonly || (this.fieldSet && this.fieldSet.realReadonly)
      }
    },
    form
  ),
  methods: {
    getFieldValue {

    },
    resetValue () {
    },
    validate (rules = this.localRules) {
      let res = rule.validate(this.getFieldValue(), rules)
      if (this.isValid(res)) {
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
      this.validate(this.interactiveRules.filter(perRule => includes(perRule.triggers, eventName)))
      this.form.$emit.apply(this.form, 'interacting', eventName)
    },
    hideValidity (invalidType) {
      this.$set(this, 'validities', this.validities.filter(validity => validity.invalidType !== invalidType))
    },
    isValid (res) {
      return isBoolean(res) && res
    }
  },
  created () {
    if (!this.field) {
      return
    }
    this.form.fields.push(this)
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

  &-invalid {
    > .veui-input,
    > .veui-textarea {
      border-color: @veui-alert-color-primary;

      &:hover {
        .veui-shadow(glow, @veui-alert-color-primary);
      }

      &:focus {
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

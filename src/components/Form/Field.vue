<template>
  <div class="veui-form-field" :class="{'veui-form-field-invalid': !validity.valid, 'veui-form-field-no-key': !label, 'veui-form-field-no-tip': !tip}">
    <veui-label v-if="label" class="veui-form-key" :label="label" :label-for="labelFor"></veui-label>
    <slot></slot>
    <span v-if="tip" class="veui-form-tip">{{ tip }}</span>
    <p v-if="!validity.valid && !!validity.message" class="veui-form-field-error" :title="validity.message"><veui-icon name="exclamation-circle"></veui-icon>{{ validity.message }}</p>
  </div>
</template>

<script>
import Label from '../Label'
import { clone, rule } from '../../managers'
import { isBoolean, assign } from 'lodash'
import { getTypedAncestorTracker, getModelProp, getModelEvent } from '../../utils/helper'
import Icon from '../Icon'
import '../../icons'
import Vue from 'vue'
const { computed: computedForm } = getTypedAncestorTracker('form')

export default {
  name: 'veui-form-field',
  uiTypes: ['form-field', 'form-container'],
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
    rules: [String, Array]
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
      realReadOnly () {
        return this.readonly || (this.fieldSet && this.fieldSet.realReadOnly)
      },
      isAllDisabled () {
        return this.disabled || this.inputs.every(input => input.disabled)
      },
      submittedValue () {
        let value = this.inputs.map(input => {
          let val = input[getModelProp(input)]
          return val === undefined ? null : val
        })
        return this.isAllDisabled
          ? undefined
          : (this.inputs.length > 1 ? value : value[0])
      }
    },
    computedForm
  ),
  watch: {
    interactiveRules (newVal, oldVal) {
      let added = newVal || []
      if (oldVal && oldVal.length) {
        let diff = rule.diffRules(newVal, oldVal)
        diff.removed.forEach(perRule => {
          perRule.triggers.split(',').forEach(trigger => {
            this.inputs.forEach(input => {
              input.$off(trigger, this.handlers[perRule.name])
            })
          })
        })
        added = diff.added
      }
      this.bindInteractiveRules(this.inputs, added)
    }
  },
  methods: {
    resetValue () {
      this.inputs.forEach(input => {
        let event = getModelEvent(input)
        input.$emit(event, clone.exec(input.initialData))
      })
    },
    validate () {
      if (!this.inputs.length) {
        this.hideValidity('local')
        return true
      }

      // 检验的时候所有 rules 一起上
      let rules = this.localRules
      let inputs = this.inputs
      // 支持多个 input 之后，这个 message 应该是取第一次出错的 message
      let res
      let isError = inputs.some(input => {
        // 检查到有出错就停止，disable不检查
        if (!input.disabled) {
          res = rule.validate(input[getModelProp(input)], rules)
          return !this.isValid(res)
        }
      })
      if (isError) {
        this.validities.unshift({
          valid: false,
          message: res,
          invalidType: 'local'
        })
      } else {
        this.hideValidity('local')
      }
      return res
    },
    bindInteractiveRules (inputs, rules = this.interactiveRules) {
      rules && rules.forEach(perRule => {
        // submit 可能揉在有其他 interactive 的里边，要过滤掉
        perRule.triggers.split(',').filter(event => event !== 'submit').forEach(event => {
          inputs.forEach(input => {
            assign(this.handlers, {
              [event]: e => {
                Vue.nextTick(() => {
                  let res = rule.validate(input[getModelProp(input)], [perRule])
                  if (this.isValid(res)) {
                    this.hideValidity('local')
                  } else {
                    this.validities.unshift({
                      valid: false,
                      message: res,
                      invalidType: 'local'
                    })
                  }
                })
              }
            })
            input.$on(event, this.handlers[event])
          })
        })
      })
    },
    addInteractiveValidator (event, handler) {
      this.inputs.forEach(input => {
        input.$on(event, handler)
      })
    },
    removeInteractiveValidator (event, handler) {
      this.inputs.forEach(input => {
        input.$off(event, handler)
      })
    },
    hideValidity (invalidType) {
      this.$set(this, 'validities', this.validities.filter(validity => validity.invalidType !== invalidType))
    },
    isValid (res) {
      return isBoolean(res) && res
    }
  },
  created () {
    this.form.fields.push(this)
  },
  beforeDestroy () {
    this.form.fields.splice(this.form.fields.indexOf(this), 1)
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-form-field {
  vertical-align: top;
  margin-bottom: @veui-form-field-gap;
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

  .veui-form-tip + .veui-form-field-error {
    position: absolute;
    display: block;
    margin: 0;
    height: @veui-form-field-gap;
    line-height: @veui-form-field-gap;
  }

  .veui-form-key ~ .veui-form-tip + .veui-form-field-error {
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

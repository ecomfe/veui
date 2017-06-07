<template>
  <div class="veui-form-value" :class="{'veui-form-value-invalid': invalid}">
    <slot></slot>
    <p v-if="invalid" class="veui-form-value-error" :title="errMsg"><veui-icon name="exclamation-circle"></veui-icon>{{ errMsg }}</p>
  </div>
</template>

<script>
import Validator from '../../utils/validators'
import cloneDeep from '../../managers/cloneDeep'
import { includes, isBoolean, assign } from 'lodash'
import { genParentTracker, getCustomModelProp, getCustomModelEvent, splitToArray } from '../../utils/helper'
import Icon from '../Icon'
import Vue from 'vue'
import 'vue-awesome/icons/exclamation-circle'
const { computed: computedForm } = genParentTracker('form')

export default {
  name: 'veui-form-value',
  uiTypes: ['formValue', 'formContainer'],
  components: {
    'veui-icon': Icon
  },
  props: {
    rules: [String, Array]
  },
  data () {
    return {
      invalid: false,
      invalidType: null,
      errMsg: '',
      rulesCbStore: {},
      initialData: null
    }
  },
  computed: assign(
    {
      input () {
        return this.$children && this.$children.find(child => includes(child.$options.uiTypes, 'input'))
      }
    },
    {
      localRules () {
        if (!this.rules) {
          return null
        } else {
          let rules
          if (Array.isArray(this.rules)) {
            rules = cloneDeep(this.rules)
            Validator.initRules(rules)
          } else {
            rules = this.rules.trim().split(/\s+/).map(rule => {
              return {
                name: rule,
                value: true
              }
            })
            Validator.initRules(rules)
          }
          return rules
        }
      }
    },
    {
      interactiveRules () {
        return this.localRules
          ? this.localRules.filter(rule => {
            if (!rule.triggers) {
              return false
            }

            let triggers = splitToArray(rule.triggers)
            // 没有写triggers按submit处理，写了triggers且不只是submit才放进来
            return !!rule.triggers && !(triggers.length === 1 && triggers[0] === 'submit')
          })
          : []
      }
    },
    computedForm
  ),
  watch: {
    interactiveRules (newVal, oldVal) {
      let added = newVal || []
      if (oldVal && oldVal.length) {
        let diff = Validator.diffRules(newVal, oldVal)
        diff.removed.forEach(rule => {
          splitToArray(rule.triggers).forEach(trigger => {
            this.input.$off(trigger, this.rulesCbStore[rule.name])
          })
        })
        added = diff.added
      }
      this.bindInteractiveRules(added)
    }
  },
  methods: {
    resetValue () {
      let input = this.input
      let event = getCustomModelEvent(input)
      input.$emit(event, cloneDeep(this.initialData))
    },
    validate () {
      let rules = this.localRules
      let input = this.input
      let prop = getCustomModelProp(input)
      let res = Validator.validate(input[prop], rules)
      if (this.isValid(res)) {
        this.hideValidity()
        return res
      } else {
        this.setValidity(res.err, res.name)
        return res.err
      }
    },
    bindInteractiveRules (rules) {
      let input = this.input
      let prop = getCustomModelProp(input)
      rules && rules.forEach(rule => {
        splitToArray(rule.triggers).filter(event => event !== 'submit').forEach(event => {
          let me = this
          // TODO: dirty
          assign(this.rulesCbStore, {
            [event]: e => {
              Vue.nextTick(() => {
                let res = Validator.validate(input[prop], [rule])
                if (me.isValid(res)) {
                  me.hideValidity(rule.name)
                } else {
                  me.setValidity(res.err, rule.name)
                }
              })
            }
          })
          input.$on(event, this.rulesCbStore[event])
        })
      })
    },
    setValidity (err, invalidType) {
      this.invalid = true
      this.invalidType = invalidType || 'custom'
      this.errMsg = err
    },
    hideValidity (invalidType) {
      if (!invalidType || this.invalidType === invalidType) {
        this.invalid = false
        this.errMsg = ''
      }
    },
    isValid (res) {
      return isBoolean(res) && res
    }
  },
  created () {
    this.form.items.push(this)
  },
  mounted () {
    this.bindInteractiveRules(this.interactiveRules)
  },
  beforeDestroy () {
    this.form.items.splice(this.form.items.indexOf(this), 1)
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-form-value {
  display: inline-block;
  vertical-align: top;

  & + & {
    margin-left: 10px;
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
}

.veui-form-value-error {
  position: absolute;
  margin: 4px 0 0;
  color: @veui-alert-color-primary;
  vertical-align: top;

  svg {
    vertical-align: -2px;
    margin-right: 7px;
  }
}

.veui-form-value-invalid:last-child {
  .veui-form-value-error  {
    position: static;
    display: inline-block;
    height: @veui-height-normal;
    line-height: @veui-height-normal;
    margin: 0 0 0 10px;
  }
}

</style>
